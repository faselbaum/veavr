import * as TypeScript from 'typescript'
import * as NodePath from 'node:path'
import * as NodeFs from 'node:fs'
import * as NodeChildProcess from 'node:child_process'
import TsConfigLoader from 'tsconfig-loader'
import * as FindUp from 'find-up'
import * as TypeFest from 'type-fest'
import * as TsDeepMerge from 'ts-deepmerge'
import * as Tar from 'tar'
import * as Glob from 'glob'
import { findWorkspacePackageDir } from './find-workspace-package-dir.js'
import * as ProjectFileManager from './project-file-manager.js'

export async function buildProjects(options: {
  packageName: string
  entryPointFileGlob: string[]
  additionalSourceFilesGlob?: string[]
}): Promise<ProjectFileManager.ProjectFileManager[]> {
  const packageDir = await findWorkspacePackageDir({
    packageName: options.packageName,
  })
  const entryPointFilePaths = Glob.globSync(options.entryPointFileGlob, {
    cwd: packageDir,
  })

  const result: ProjectFileManager.ProjectFileManager[] = []

  for (const filePath of entryPointFilePaths) {
    const projectManager = await buildProject({
      entryPointFilePath: filePath,
      additionalSourceFilesGlob: options.additionalSourceFilesGlob,
      packageName: options.packageName,
    })

    result.push(projectManager)
  }

  return result
}

export async function buildProject(options: {
  packageName: string
  entryPointFilePath: string
  additionalSourceFilesGlob?: string[]
}): Promise<ProjectFileManager.ProjectFileManager> {
  const packageDir = await findWorkspacePackageDir({
    packageName: options.packageName,
  })

  const projectFileManager = new ProjectFileManager.ProjectFileManager({
    sourcePackageName: options.packageName,
    sourcePackageDirPath: packageDir!,
    entryFilePath: options.entryPointFilePath,
  })

  const absoluteEntryPointFilePath = NodePath.resolve(
    packageDir!,
    options.entryPointFilePath
  )

  const absoluteAdditionalSourceFilePaths = (
    options.additionalSourceFilesGlob ?? []
  ).map((filePath) => NodePath.resolve(packageDir!, filePath))

  const { tsConfigFilePath, entryFileMountPoint } = addTypeScriptFiles({
    entryPointFilePath: absoluteEntryPointFilePath,
    projectFileManager,
    additionalSourceFiles: absoluteAdditionalSourceFilePaths,
    tsConfigOverrides: {
      compilerOptions: {
        allowImportingTsExtensions: true,
      },
    },
  })

  addViteConfig({ projectFileManager })
  addIndexHtml({ projectFileManager })
  addMountScript({ projectFileManager, entryFileMountPoint })

  const closestPackageJsonFilePath = FindUp.findUpSync('package.json', {
    cwd: NodePath.dirname(tsConfigFilePath),
  })!

  await addPackageJson({
    projectFileManager,
    packageJsonFilePath: closestPackageJsonFilePath,
    overrides: {
      scripts: {
        dev: 'vite',
      },
      dependencies: {
        react: 'latest',
        'react-dom': 'latest',
        vite: 'latest',
        '@vitejs/plugin-react': 'latest',
        'vite-tsconfig-paths': 'latest',
      },
    },
  })

  return projectFileManager
}

function addTypeScriptFiles(options: {
  entryPointFilePath: string
  projectFileManager: ProjectFileManager.ProjectFileManager
  additionalSourceFiles?: string[]
  tsConfigOverrides?: TypeFest.TsConfigJson
}): { tsConfigFilePath: string; entryFileMountPoint: string } {
  const tsConfigFilePath = TypeScript.findConfigFile(
    options.entryPointFilePath,
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

  const additionalSourceFiles = Glob.globSync(
    options.additionalSourceFiles ?? [],
    { cwd: options.projectFileManager.sourcePackageDirPath }
  )

  const program = TypeScript.createProgram({
    options: tsConfig.options,
    rootNames: [options.entryPointFilePath, ...(additionalSourceFiles ?? [])],
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

      options.projectFileManager.addFile({
        mountPath: fileMountPath,
        filePath: file.fileName,
      })
    })

  const resolvedTsConfigJsonObject = getResolvedTsConfigJsonObject({
    tsConfigFilePath,
    overrides: options.tsConfigOverrides,
  })

  options.projectFileManager.addVirtualFile({
    mountPath: 'tsconfig.json',
    fileContent: JSON.stringify(resolvedTsConfigJsonObject),
  })

  return {
    tsConfigFilePath,
    entryFileMountPoint: NodePath.relative(
      NodePath.dirname(tsConfigFilePath),
      options.entryPointFilePath
    ),
  }
}

function getResolvedTsConfigJsonObject({
  tsConfigFilePath,
  overrides,
}: {
  tsConfigFilePath: string
  overrides?: TypeFest.TsConfigJson
}): TypeFest.TsConfigJson {
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

  const mergedConfig = TsDeepMerge.merge(tsConfigObject, overrides)

  return mergedConfig
}

async function addPackageJson(options: {
  packageJsonFilePath: string
  projectFileManager: ProjectFileManager.ProjectFileManager
  overrides?: TypeFest.PackageJson.PackageJsonStandard
}): Promise<void> {
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

  await resolveWorkspaceDependencies({
    packageJsonPath: options.packageJsonFilePath,
    packageJson: packageJsonObject,
    projectFileManager: options.projectFileManager,
  })

  options.projectFileManager.addVirtualFile({
    mountPath: 'package.json',
    fileContent: JSON.stringify(packageJsonObject),
  })
}

async function resolveWorkspaceDependencies(options: {
  packageJsonPath: string
  packageJson: TypeFest.PackageJson.PackageJsonStandard
  projectFileManager: ProjectFileManager.ProjectFileManager
}): Promise<void> {
  const tempDir = NodePath.resolve(
    NodePath.dirname(
      FindUp.findUpSync('package.json', { cwd: import.meta.dirname })!
    ),
    './temp'
  )

  NodeFs.mkdirSync(tempDir, { recursive: true })

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

      const dependencyPackageDir = await findWorkspacePackageDir({
        packageName: dependencyKey,
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
        mountPath: NodePath.join('local_modules/', dependencyKey),
      })

      dependencies[dependencyKey] = `file:local_modules/${dependencyKey}`
    }
  }

  NodeFs.rmSync(tempDir, { recursive: true })
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&family=Playwrite+CU:wght@100..400&family=Roboto+Slab:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <style>
          *, *::before, *::after {
            box-sizing: border-box;
            -moz-osx-font-smoothing: grayscale;
            -webkit-font-smoothing: antialiased;
            font-smoothing: antialiased;
          }
          * {
            margin: 0;
          }
          body {
            line-height: 1.5;
          }
          img, picture, video, canvas, svg {
            display: block;
            max-width: 100%;
          }
          input, button, textarea, select {
            font: inherit;
          }
          p, h1, h2, h3, h4, h5, h6 {
            overflow-wrap: break-word;
          }
          #root, #__next {
            isolation: isolate;
          }
        </style>
        <style>
          #root {
            padding: 40px;
            display: flex;
            flex-wrap: wrap;
            gap: 20px;

            align-items: end;
            justify-content: space-evenly;
          }
        </style>
      </head>
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
    import { createRoot } from "react-dom/client";    
    import { Application } from "../${options.entryFileMountPoint}";

    const root = createRoot(document.querySelector('#root')!);
    root.render(<Application />);
  `

  options.projectFileManager.addVirtualFile({
    mountPath: 'src/mount.tsx',
    fileContent: mountScript,
  })
}
