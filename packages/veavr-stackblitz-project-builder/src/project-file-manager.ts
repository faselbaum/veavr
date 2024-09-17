import * as NodePath from 'node:path'
import * as NodeFs from 'node:fs'
import * as Glob from 'glob'

type AddOptions<T> = T & {
  mountPath: string
}

export type OpenFileMatchFunction = (options: {
  fileMountPath: string
}) => boolean

export class ProjectFileManager {
  #mountedFiles: Record<string, string> = {}
  #sourcePackageName: string = ''
  #openFiles: string[] = []
  #entryFilePath: string = ''
  #openFileMatcher?: OpenFileMatchFunction = undefined

  public constructor(options: {
    sourcePackageName: string
    entryFilePath: string
    openFileMatcher?: OpenFileMatchFunction
  }) {
    this.#sourcePackageName = options.sourcePackageName
    this.#entryFilePath = options.entryFilePath
    this.#openFileMatcher = options.openFileMatcher
  }

  get openFiles(): ReadonlyArray<string> {
    return this.#openFiles
  }

  #addFile({
    mountPath,
    fileContent,
  }: AddOptions<{ fileContent: string }>): void {
    this.#mountedFiles[mountPath] = fileContent

    if (mountPath === this.#entryFilePath) {
      this.#openFiles = [mountPath, ...this.#openFiles]
    } else if (
      this.#openFileMatcher &&
      this.#openFileMatcher({ fileMountPath: mountPath })
    ) {
      this.#openFiles = [...this.#openFiles, mountPath]
    }
  }

  addVirtualFile(
    options: AddOptions<{
      fileContent: string
    }>
  ) {
    this.#addFile(options)
  }

  addFile({
    filePath,
    mountPath,
  }: AddOptions<{
    filePath: string
  }>): void {
    const fileContent = NodeFs.readFileSync(filePath).toString()
    this.#addFile({ mountPath, fileContent })
  }

  addDir({ dirPath, mountPath }: AddOptions<{ dirPath: string }>): void {
    const files = Glob.globSync('./**/*.*', { cwd: dirPath })

    for (const filePath of files) {
      const mountedFilePath = NodePath.join(mountPath, filePath)
      const absoluteFilePath = NodePath.resolve(dirPath, './', filePath)
      this.addFile({
        filePath: absoluteFilePath,
        mountPath: mountedFilePath,
      })
    }
  }

  getProjectFiles(): Record<string, string> {
    return this.#mountedFiles
  }

  writeProjectModule(options: { outDir: string }): void {
    const fileContent = `
      import * as Stackblitz from '@stackblitz/sdk'

      export const projectFiles: Stackblitz.ProjectFiles = ${JSON.stringify(this.#mountedFiles)}

      export const projectOptions: Stackblitz.ProjectOptions = {
        openFile: ${JSON.stringify(this.openFiles.join(','))}
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
