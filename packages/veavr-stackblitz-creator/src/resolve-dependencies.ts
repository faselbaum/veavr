import * as TypeScript from 'typescript'
import * as Path from 'node:path'
import * as Fs from 'node:fs'

const entryFilePath = Path.resolve(
  '../veavr-react-components/src/components/card/usage-default.tsx'
)

const tsConfigFilePath = TypeScript.findConfigFile(entryFilePath, (path) =>
  Fs.existsSync(path)
)!

console.log(Path.dirname(tsConfigFilePath))

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
    Path.resolve('../veavr-react-components/src/declarations/emotion.d.ts'),
  ],
})

const sourceDir = Path.resolve('../veavr-react-components/src/')
console.log(sourceDir)

console.log(
  program
    .getSourceFiles()
    .filter(
      (file) =>
        !program.isSourceFileFromExternalLibrary(file) &&
        !program.isSourceFileDefaultLibrary(file)
    )
    .map((file) => file.fileName)
)
