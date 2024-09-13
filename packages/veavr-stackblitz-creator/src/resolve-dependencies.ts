import * as TypeScript from 'typescript'
import * as NodePath from 'node:path'
import * as NodeFs from 'node:fs'
import * as TsConfigLoader from 'tsconfig-loader'
import * as FindUp from 'find-up'
import * as TypeFest from 'type-fest'
import * as TsDeepMerge from 'ts-deepmerge'

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
