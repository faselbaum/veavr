import * as NodePath from 'node:path'
import * as NodeFs from 'node:fs'
import * as Glob from 'glob'

export class ProjectFileManager {
  #mountedFiles: Record<string, string> = {}

  addVirtualFile({
    mountPath,
    fileContent,
  }: {
    mountPath: string
    fileContent: string
  }) {
    this.#mountedFiles[mountPath] = fileContent
  }

  addFile({
    filePath,
    mountPath,
  }: {
    filePath: string
    mountPath: string
  }): void {
    const fileContent = NodeFs.readFileSync(filePath).toString()
    this.#mountedFiles[mountPath] = fileContent
  }

  addDir({ dirPath, mountPath }: { dirPath: string; mountPath: string }): void {
    const files = Glob.globSync('./**/*.*', { cwd: dirPath })

    for (const filePath of files) {
      const mountedFilePath = NodePath.join(mountPath, filePath)
      const absoluteFilePath = NodePath.resolve(dirPath, './', filePath)
      this.addFile({ filePath: absoluteFilePath, mountPath: mountedFilePath })
    }
  }

  getProjectFiles(): Record<string, string> {
    return this.#mountedFiles
  }

  writeProjectModule(options: { outDir: string }): void {
    NodeFs.mkdirSync(options.outDir, { recursive: true })

    const fileContent = `
      import * as Stackblitz from '@stackblitz/sdk'

      export const projectFiles: Stackblitz.ProjectFiles = ${JSON.stringify(this.#mountedFiles)}
    `

    const outPath = NodePath.resolve(
      options.outDir,
      './stackblitz.project.generated.ts'
    )

    NodeFs.writeFileSync(outPath, fileContent, { flag: 'w+' })
  }

  log(): void {
    console.log(this.#mountedFiles)
  }
}
