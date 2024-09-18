import * as React from 'react'
import * as StackblitzSdk from '@stackblitz/sdk'
import * as StackblitzProjectBuilder from '@veavr/stackblitz-project-builder'
import styled from '@emotion/styled'

const LiveCodeRoot = styled.div`
  height: 40vw;
  display: flex;
  align-items: stretch;

  & iframe {
    border: none;
  }
`

export type LiveCodePlaygroundProps = {
  module: Promise<StackblitzProjectBuilder.ProjectModule>
}

export const LiveCodePlayground: React.FunctionComponent<
  LiveCodePlaygroundProps
> = (props) => {
  const hostId = `stackblitz-host-${React.useId()}`
  const [project, setProject] = React.useState<
    StackblitzProjectBuilder.CompiledProject | undefined
  >(undefined)

  React.useEffect(() => {
    async function loadModule() {
      const loaded = await props.module
      setProject(loaded.default)
    }

    if (!project) {
      loadModule()
    }
  }, [props.module])

  React.useEffect(() => {
    if (!project) {
      return
    }

    StackblitzSdk.default.embedProject(
      hostId,
      {
        template: 'node',
        files: project.projectFiles,
        title: 'veavr Playground',
      },
      {
        openFile: project.entryPointMountPath,
        startScript: 'dev',
        terminalHeight: 0,
      }
    )
  }, [project])

  return (
    <LiveCodeRoot>
      <div id={hostId} />
    </LiveCodeRoot>
  )
}
