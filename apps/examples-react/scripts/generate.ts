import * as NodePath from 'node:path'
import * as StackblitzProjectBuilder from '@veavr/stackblitz-project-builder'

const outDir = NodePath.resolve(
  import.meta.dirname,
  '../src/stackblitz-projects'
)

const projects = await StackblitzProjectBuilder.buildProjects({
  packageName: '@veavr/react-components',
  entryPointFileGlob: ['./src/**/application.*'],
  additionalSourceFilesGlob: ['./src/**/*.d.ts'],
})

for (const project of projects) {
  project.writeProjectModule({ outDir })
}
