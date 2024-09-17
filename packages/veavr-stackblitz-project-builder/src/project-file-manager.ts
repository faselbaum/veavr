import * as NodePath from 'node:path'
import * as NodeFs from 'node:fs'
import * as Glob from 'glob'

type AddOptions<T> = T & {
  mountPath: string
}

export class ProjectFileManager {
  #mountedFiles: Record<string, string> = {}
  #sourcePackageName: string = ''
  #openFiles: string[] = []
  #entryFilePath: string = ''

  public constructor(options: {
    sourcePackageName: string
    entryFilePath: string
  }) {
    this.#sourcePackageName = options.sourcePackageName
    this.#entryFilePath = options.entryFilePath
  }

  get openFiles(): string[] {
    return this.#openFiles
  }

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
  }: AddOptions<{
    filePath: string
  }>): void {
    const fileContent = NodeFs.readFileSync(filePath).toString()
    this.#mountedFiles[mountPath] = fileContent
  }

  addDir({ dirPath, mountPath }: AddOptions<{ dirPath: string }>): void {
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
    const fileContent = `
      import * as Stackblitz from '@stackblitz/sdk'

      export const projectFiles: Stackblitz.ProjectFiles = ${JSON.stringify(this.#mountedFiles)}

      export const projectOptions: Stackblitz.EmbedOptions = {
        openFile: ${JSON.stringify(this.#openFiles)}
      }
    `

    const outDir = NodePath.resolve(
      options.outDir,
      `.${NodePath.sep}${this.#sourcePackageName}`,
      NodePath.dirname(this.#entryFilePath)
    )

    NodeFs.mkdirSync(outDir, { recursive: true })

    const outPath = NodePath.resolve(
      outDir,
      `.${NodePath.sep}${NodePath.basename(this.#entryFilePath, NodePath.extname(this.#entryFilePath))}.project.generated.ts`
    )

    NodeFs.writeFileSync(outPath, fileContent, { flag: 'w+' })
  }

  log(): void {
    console.log(this.#mountedFiles)
  }
}
