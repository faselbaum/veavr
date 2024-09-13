import * as TypeScript from 'typescript'
import * as NodePath from 'node:path'
import * as NodeFs from 'node:fs'
import * as TsConfigLoader from 'tsconfig-loader'
import * as FindUp from 'find-up'
import * as TypeFest from 'type-fest'

const entryFilePath = NodePath.resolve(
  '../veavr-react-components/src/components/card/usage-default.tsx'
)

const tsConfigFilePath = TypeScript.findConfigFile(entryFilePath, (path) =>
  NodeFs.existsSync(path)
)!

console.log(tsConfigFilePath)

const parseConfigHost = {
  ...TypeScript.sys,
  onUnRecoverableConfigFileDiagnostic: (diag) => {},
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

const packageJsonObject: TypeFest.PackageJson = JSON.parse(
  NodeFs.readFileSync(closestPackageJsonFilePath).toString()
)
console.log(packageJsonObject)

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
