import * as React from 'react'
import * as StackblitzSdk from '@stackblitz/sdk'

export type ShowCaseModule = {
  projectFiles: StackblitzSdk.ProjectFiles
  projectOptions: StackblitzSdk.ProjectOptions
}

export type LiveCodePlaygroundProps = {
  module: Promise<ShowCaseModule>
}

export const LiveCodePlayground: React.FunctionComponent<
  LiveCodePlaygroundProps
> = (props) => {
  const [module, setModule] = React.useState<ShowCaseModule | undefined>(
    undefined
  )

  React.useEffect(() => {
    async function loadModule() {
      const loaded = await props.module
      setModule(loaded)
    }

    if (!module) {
      loadModule()
    }
  }, [props.module])

  React.useEffect(() => {
    if (!module) {
      return
    }

    StackblitzSdk.default.embedProject(
      'stackblitz_host',
      {
        template: 'node',
        files: module.projectFiles,
        title: 'veavr Playground',
      },
      {
        ...module.projectOptions,
        startScript: 'dev',
        terminalHeight: 0,
      }
    )
  }, [module])

  return (
    <div style={{ height: '40vw', display: 'flex', alignItems: 'stretch' }}>
      <div id="stackblitz_host" />
    </div>
  )
}
