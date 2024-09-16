import * as NodePath from 'node:path'
import * as StackblitzProjectBuilder from '@veavr/stackblitz-project-builder'

const entryFile = NodePath.resolve(
  import.meta.dirname,
  '../../../packages/veavr-react-components/src/components/card/usage-plain.tsx'
)
const themeDecl = NodePath.resolve(
  import.meta.dirname,
  '../../../packages/veavr-react-components/src/declarations/emotion.d.ts'
)

const ProjectFiles = StackblitzProjectBuilder.buildProjectForEntryPoint({
  entryPointFilePath: entryFile,
  additionalSourceFiles: [themeDecl],
})

const outDir = NodePath.resolve(
  import.meta.dirname,
  '../src/stackblitz-projects'
)

ProjectFiles.writeProjectModule({ outDir })
