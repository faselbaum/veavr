import * as NodePath from 'node:path'
import * as StackblitzProjectBuilder from '@veavr/stackblitz-project-builder'

const outDir = NodePath.resolve(
  import.meta.dirname,
  '../src/stackblitz-projects'
)

const projects = await StackblitzProjectBuilder.buildProjects({
  packageName: '@veavr/react-components',
  entryPointFileGlob: ['./src/**/showcase.*'],
  additionalSourceFilesGlob: ['./src/**/*.d.ts'],
  openFile: ({ fileMountPath, entryPointFileMountPath }) => {
    const entryFileMountDir = NodePath.dirname(entryPointFileMountPath)
    const matchRegex = new RegExp(
      `${entryFileMountDir.replaceAll('/', '\\/')}\\/component.*`
    )

    return matchRegex.test(fileMountPath)
  },
})

for (const project of projects) {
  project.writeProjectModule({ outDir })
}
