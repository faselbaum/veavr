import * as NodePath from 'node:path'
import * as NodeFs from 'node:fs'
import * as Glob from 'glob'
import * as Stackblitz from '@stackblitz/sdk'

type AddOptions<T> = T & {
  mountPath: string
}

export type CompiledProject = {
  projectFiles: Stackblitz.ProjectFiles
  entryPointMountPath: string
}

export type ProjectModule = {
  default: CompiledProject
}

export class ProjectFileManager {
  #mountedFiles: Record<string, string> = {}
  #sourcePackageName: string = ''
  #sourcePackageDirPath: string = ''
  #entryFilePath: string = ''

  public constructor(options: {
    sourcePackageName: string
    sourcePackageDirPath: string
    entryFilePath: string
  }) {
    this.#sourcePackageName = options.sourcePackageName
    this.#sourcePackageDirPath = options.sourcePackageDirPath
    this.#entryFilePath = options.entryFilePath
  }

  get sourcePackageName(): string {
    return this.#sourcePackageName
  }

  get sourcePackageDirPath(): string {
    return this.#sourcePackageDirPath
  }

  #addFile({
    mountPath,
    fileContent,
  }: AddOptions<{ fileContent: string }>): void {
    this.#mountedFiles[mountPath] = fileContent
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
    const compiledProject: CompiledProject = {
      entryPointMountPath: this.#entryFilePath,
      projectFiles: this.#mountedFiles,
    }

    const fileContent = `
      import { CompiledProject } from '@veavr/stackblitz-project-builder'

      const project = ${JSON.stringify(compiledProject, undefined, 2)} satisfies CompiledProject
      
      export default project
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
