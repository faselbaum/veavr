import * as NodeFs from 'node:fs'
import * as Glob from 'glob'

export class ProjectFileManager {
  #mountedFiles: Record<string, string> = {}

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
      const mountedFilePath = filePath
      this.addFile({ filePath: filePath, mountPath: mountedFilePath })
    }
  }

  getProjectFiles(): Record<string, string> {
    return this.#mountedFiles
  }
}
