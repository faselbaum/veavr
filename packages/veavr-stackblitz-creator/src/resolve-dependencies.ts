import * as TypeScript from 'typescript'
import * as NodePath from 'node:path'
import * as NodeFs from 'node:fs'
import * as NodeCrypto from 'node:crypto'
import * as NodeChildProcess from 'node:child_process'
import * as NodeModule from 'node:module'
import * as TsConfigLoader from 'tsconfig-loader'
import * as FindUp from 'find-up'
import * as TypeFest from 'type-fest'
import * as TsDeepMerge from 'ts-deepmerge'
import * as Tar from 'tar'
import * as Glob from 'glob'

const require = NodeModule.createRequire(import.meta.url)

type FileCache = Map<string, string>

const entryFilePath = NodePath.resolve(
  '../veavr-react-components/src/components/card/usage-default.tsx'
)

const tsConfigFilePath = TypeScript.findConfigFile(
  entryFilePath,
  TypeScript.sys.fileExists
)!

console.log(tsConfigFilePath)

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
  rootNames: [
    entryFilePath,
    NodePath.resolve('../veavr-react-components/src/declarations/emotion.d.ts'),
  ],
})

const requiredFiles = program
  .getSourceFiles()
  .filter(
    (file) =>
      !program.isSourceFileFromExternalLibrary(file) &&
      !program.isSourceFileDefaultLibrary(file)
  )
  .map((file) =>
    NodePath.relative(NodePath.dirname(tsConfigFilePath), file.fileName)
  )

console.log(requiredFiles)

const closestPackageJsonFilePath = FindUp.findUpSync('package.json', {
  cwd: NodePath.dirname(tsConfigFilePath),
})!
console.log(closestPackageJsonFilePath)

console.log(
  createPackageJsonContent({
    basePackageJsonFilePath: closestPackageJsonFilePath,
  })
)

function createPackageJsonContent(options: {
  basePackageJsonFilePath: string
  overrides?: TypeFest.PackageJson.PackageJsonStandard
}): TypeFest.PackageJson.PackageJsonStandard {
  const basePackageJsonObject: TypeFest.PackageJson.PackageJsonStandard =
    JSON.parse(NodeFs.readFileSync(options.basePackageJsonFilePath).toString())

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

  const workspaceDependenciesFileMap = replaceWorkspaceDependencies({
    packageJson: packageJsonObject,
    fileCache: new Map(),
  })

  console.log(workspaceDependenciesFileMap)

  return packageJsonObject
}

function getResolvedTsConfigJsonObject(
  tsConfigPath: string
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

  console.log(tsConfigObject)

  return tsConfigObject
}

function replaceWorkspaceDependencies(options: {
  packageJson: TypeFest.PackageJson.PackageJsonStandard
  fileCache: FileCache
}): Record<string, string> {
  const result: Record<string, string> = {}
  const tempDir = NodePath.resolve(
    NodePath.dirname(
      FindUp.findUpSync('package.json', { cwd: import.meta.dirname })!
    ),
    './temp'
  )

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

      const modulePath = require.resolve(NodePath.join(dependencyKey))
      const packageJsonPath = FindUp.findUpSync('package.json', {
        cwd: modulePath,
      })!
      const packageDir = NodePath.dirname(packageJsonPath)

      const tgzPath = NodeChildProcess.execSync(
        `pnpm pack --pack-destination "${tempDir}"`,
        {
          cwd: packageDir,
        }
      )
        .toString()
        .trim()

      const unpackDir = NodePath.resolve(tempDir, './', dependencyKey)
      NodeFs.mkdirSync(unpackDir, { recursive: true })
      Tar.extract({ sync: true, file: tgzPath, cwd: unpackDir, strip: 1 })

      const packageFiles = Glob.globSync('./**/*.*', { cwd: unpackDir })

      packageFiles.forEach((filePath) => {
        const finalPath = NodePath.join(
          'node_modules/',
          dependencyKey,
          filePath
        )

        result[finalPath] = NodeFs.readFileSync(
          NodePath.resolve(unpackDir, filePath)
        ).toString()
      })
    }

    depkeysToDelete.forEach((key) => Reflect.deleteProperty(dependencies, key))
  }

  NodeFs.rmSync(tempDir, { recursive: true })

  return result
}
