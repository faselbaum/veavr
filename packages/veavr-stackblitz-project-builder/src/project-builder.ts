import * as TypeScript from 'typescript'
import * as NodePath from 'node:path'
import * as NodeFs from 'node:fs'
import * as NodeChildProcess from 'node:child_process'
import * as NodeModule from 'node:module'
import TsConfigLoader from 'tsconfig-loader'
import * as FindUp from 'find-up'
import * as TypeFest from 'type-fest'
import * as TsDeepMerge from 'ts-deepmerge'
import * as Tar from 'tar'
import * as ProjectFileManager from './project-file-manager.js'

export function buildProjectForEntryPoint(options: {
  entryPointFilePath: string
  additionalSourceFiles?: string[]
}): ProjectFileManager.ProjectFileManager {
  const projectFileManager = new ProjectFileManager.ProjectFileManager()

  const { tsConfigFilePath, entryFileMountPoint } = addTypeScriptFiles({
    entryPointFilePath: options.entryPointFilePath,
    projectFileManager,
    additionalSourceFiles: options.additionalSourceFiles,
  })

  addViteConfig({ projectFileManager })
  addIndexHtml({ projectFileManager })
  addMountScript({ projectFileManager, entryFileMountPoint })

  const closestPackageJsonFilePath = FindUp.findUpSync('package.json', {
    cwd: NodePath.dirname(tsConfigFilePath),
  })!

  addPackageJson({
    projectFileManager,
    packageJsonFilePath: closestPackageJsonFilePath,
  })

  projectFileManager.log()

  return projectFileManager
}

function addTypeScriptFiles({
  entryPointFilePath,
  projectFileManager,
  additionalSourceFiles,
}: {
  entryPointFilePath: string
  projectFileManager: ProjectFileManager.ProjectFileManager
  additionalSourceFiles?: string[]
}): { tsConfigFilePath: string; entryFileMountPoint: string } {
  const tsConfigFilePath = TypeScript.findConfigFile(
    entryPointFilePath,
    TypeScript.sys.fileExists
  )!

  const parseConfigHost = {
    ...TypeScript.sys,
    onUnRecoverableConfigFileDiagnostic: () => {},
  }

  const tsConfig = TypeScript.getParsedCommandLineOfConfigFile(
    tsConfigFilePath,
    undefined,
    parseConfigHost
  )!

  const program = TypeScript.createProgram({
    options: tsConfig.options,
    rootNames: [entryPointFilePath, ...(additionalSourceFiles ?? [])],
  })

  program
    .getSourceFiles()
    .filter(
      (file) =>
        !program.isSourceFileFromExternalLibrary(file) &&
        !program.isSourceFileDefaultLibrary(file)
    )
    .forEach((file) => {
      const fileMountPath = NodePath.relative(
        NodePath.dirname(tsConfigFilePath),
        file.fileName
      )
      projectFileManager.addFile({
        mountPath: fileMountPath,
        filePath: file.fileName,
      })
    })

  const resolvedTsConfigJsonObject =
    getResolvedTsConfigJsonObject(tsConfigFilePath)

  projectFileManager.addVirtualFile({
    mountPath: 'tsconfig.json',
    fileContent: JSON.stringify(resolvedTsConfigJsonObject),
  })

  return {
    tsConfigFilePath,
    entryFileMountPoint: NodePath.relative(
      NodePath.dirname(tsConfigFilePath),
      entryPointFilePath
    ),
  }
}

function getResolvedTsConfigJsonObject(
  tsConfigFilePath: string
): TsConfigLoader.Tsconfig {
  const tsConfigObject = JSON.parse(
    JSON.stringify(
      TsConfigLoader.default({
        cwd: NodePath.dirname(tsConfigFilePath),
        filename: tsConfigFilePath,
      })?.tsConfig
    ).replaceAll('${configDir}', '.')
  )
  tsConfigObject.compilerOptions.baseUrl = '.'
  delete tsConfigObject.extends

  return tsConfigObject
}

function addPackageJson(options: {
  packageJsonFilePath: string
  projectFileManager: ProjectFileManager.ProjectFileManager
  overrides?: TypeFest.PackageJson.PackageJsonStandard
}): void {
  const basePackageJsonObject: TypeFest.PackageJson.PackageJsonStandard =
    JSON.parse(NodeFs.readFileSync(options.packageJsonFilePath).toString())

  const copyFields: (keyof TypeFest.PackageJson.PackageJsonStandard)[] = [
    'name',
    'type',
    'dependencies',
    'devDependencies',
    'optionalDependencies',
  ]

  const trimmedBasePackageJsonObject = copyFields.reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: basePackageJsonObject[curr],
    }),
    {} as TypeFest.PackageJson.PackageJsonStandard
  )

  const packageJsonObject: TypeFest.PackageJson.PackageJsonStandard =
    TsDeepMerge.merge(trimmedBasePackageJsonObject, options.overrides ?? {})

  resolveWorkspaceDependencies({
    packageJsonPath: options.packageJsonFilePath,
    packageJson: packageJsonObject,
    projectFileManager: options.projectFileManager,
  })

  options.projectFileManager.addVirtualFile({
    mountPath: 'package.json',
    fileContent: JSON.stringify(packageJsonObject),
  })
}

function resolveWorkspaceDependencies(options: {
  packageJsonPath: string
  packageJson: TypeFest.PackageJson.PackageJsonStandard
  projectFileManager: ProjectFileManager.ProjectFileManager
}): void {
  const tempDir = NodePath.resolve(
    NodePath.dirname(
      FindUp.findUpSync('package.json', { cwd: import.meta.dirname })!
    ),
    './temp'
  )

  NodeFs.mkdirSync(tempDir)

  for (const packageJsonKey in options.packageJson) {
    if (!/dependencies/i.test(packageJsonKey)) {
      continue
    }

    const dependencies: Record<string, string> = Reflect.get(
      options.packageJson,
      packageJsonKey
    )

    if (!dependencies) {
      continue
    }

    const depkeysToDelete: string[] = []

    for (const [dependencyKey, dependencyValue] of Object.entries(
      dependencies
    )) {
      if (!/workspace\:/i.test(dependencyValue)) {
        continue
      }

      depkeysToDelete.push(dependencyKey)

      const dependencyPackageDir = findPackageDir({
        packageName: dependencyKey,
        startPath: options.packageJsonPath,
      })!

      const packResponse = NodeChildProcess.execSync(
        `npm pack --pack-destination "${tempDir}"`,
        {
          cwd: dependencyPackageDir,
        }
      )
        .toString()
        .trim()
      const tgzPath = NodePath.resolve(tempDir, packResponse)

      const unpackDir = NodePath.resolve(tempDir, './', dependencyKey)
      NodeFs.mkdirSync(unpackDir, { recursive: true })
      Tar.extract({ sync: true, file: tgzPath, cwd: unpackDir, strip: 1 })

      options.projectFileManager.addDir({
        dirPath: unpackDir,
        mountPath: NodePath.join('node_modules/', dependencyKey),
      })
    }

    depkeysToDelete.forEach((key) => Reflect.deleteProperty(dependencies, key))
  }

  NodeFs.rmSync(tempDir, { recursive: true })
}

function findPackageDir(options: {
  packageName: string
  startPath?: string
}): string | undefined {
  const trySubPaths = ['', '/package.json']

  const sanitizedOptions = {
    ...options,
    startPath: options.startPath
      ? NodePath.dirname(options.startPath)
      : process.cwd(),
  }

  const require = NodeModule.createRequire(sanitizedOptions.startPath)

  let modulePath: string | undefined = undefined
  for (const subPath of trySubPaths) {
    if (modulePath !== undefined) {
      break
    }

    try {
      const tryPath = NodePath.join(sanitizedOptions.packageName, subPath)
      modulePath = require.resolve(tryPath)
    } finally {
      continue
    }
  }

  const packageJsonPath = FindUp.findUpSync('package.json', {
    cwd: modulePath,
  })!
  const packageDir = NodePath.dirname(packageJsonPath)

  return packageDir
}

function addViteConfig(options: {
  projectFileManager: ProjectFileManager.ProjectFileManager
}): void {
  const viteConfig = `
    import { defineConfig } from "vite";
    import react from "@vitejs/plugin-react";
    import tsconfigPaths from "vite-tsconfig-paths";

    export default defineConfig({
      plugins: [react(), tsconfigPaths()],
    });
  `

  options.projectFileManager.addVirtualFile({
    mountPath: 'vite.config.ts',
    fileContent: viteConfig,
  })
}

function addIndexHtml(options: {
  projectFileManager: ProjectFileManager.ProjectFileManager
}): void {
  const indexHtml = `
    <html>
      <body>
        <div id="root"></div>
        <script type="module" src="./src/mount.tsx"></script>
      </body>
    </html>
  `

  options.projectFileManager.addVirtualFile({
    mountPath: 'index.html',
    fileContent: indexHtml,
  })
}

function addMountScript(options: {
  entryFileMountPoint: string
  projectFileManager: ProjectFileManager.ProjectFileManager
}): void {
  const mountScript = `
    import * as React from "react";
    import { createRoot } from "react-dom/client";
    import { Application } from "../${options.entryFileMountPoint}";
    
    const root = createRoot(document.querySelector('#root')!);
    root.render(Application);
  `

  options.projectFileManager.addVirtualFile({
    mountPath: 'src/mount.tsx',
    fileContent: mountScript,
  })
}
