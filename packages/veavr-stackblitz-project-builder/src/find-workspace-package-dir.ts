import { findWorkspaceDir } from '@pnpm/find-workspace-dir'
import { findWorkspacePackages } from '@pnpm/find-workspace-packages'

export async function findWorkspacePackageDir(options: {
  packageName: string
}): Promise<string | undefined> {
  const workspaceRoot = await findWorkspaceDir(import.meta.dirname)
  const packages = await findWorkspacePackages(workspaceRoot!)

  const matchingPackage = packages.find(
    (project) => project.manifest.name === options.packageName
  )

  return matchingPackage?.dir
}
