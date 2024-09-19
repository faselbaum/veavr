import * as React from 'react'
import * as StackblitzSdk from '@stackblitz/sdk'
import * as StackblitzProjectBuilder from '@veavr/stackblitz-project-builder'
import styled from '@emotion/styled'

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  margin-block-end: 40px;
`

const Button = styled.button`
  border: none;
  background: #1574ef;
  color: white;
  border-radius: 9000px;
  cursor: pointer;

  padding: 12px;
  padding-inline: 20px;
`

export type LiveCodePlaygroundButtonProps = {
  module:
    | (() => Promise<StackblitzProjectBuilder.ProjectModule>)
    | StackblitzProjectBuilder.ProjectModule
  open: 'component' | 'application' | 'both'
}

export const LiveCodePlaygroundButton: React.FunctionComponent<
  LiveCodePlaygroundButtonProps
> = (props) => {
  const handleClick: React.MouseEventHandler = async () => {
    const module =
      typeof props.module === 'function' ? await props.module() : props.module
    const project = module.default

    let openFile: string | undefined = undefined

    switch (props.open) {
      case 'application': {
        openFile = project.entryPointMountPath
        break
      }
      case 'component': {
        openFile = findComponentMountPoint(project)
        break
      }
      case 'both': {
        const componentMountPoint = findComponentMountPoint(project)
        openFile = [
          project.entryPointMountPath,
          ...(componentMountPoint ? [componentMountPoint] : []),
        ].join(',')
        break
      }
    }

    StackblitzSdk.default.openProject(
      {
        template: 'node',
        files: project.projectFiles,
        title: 'veavr Playground',
      },
      {
        openFile,
        startScript: 'dev',
        terminalHeight: 0,
      }
    )
  }

  return (
    <Root>
      <Button onClick={handleClick}>Open Example Playground</Button>
    </Root>
  )
}

function findComponentMountPoint(
  project: StackblitzProjectBuilder.CompiledProject
): string | undefined {
  const entryPointDir = project.entryPointMountPath
    .split('/')
    .slice(0, -1)
    .join('/')
  const componentMatch = new RegExp(`${entryPointDir}/component\\.`)

  for (const mountPoint in project.projectFiles) {
    if (componentMatch.test(mountPoint)) {
      return mountPoint
    }
  }

  return undefined
}
