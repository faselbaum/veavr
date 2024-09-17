import * as React from 'react'
import * as StackblitzSdk from '@stackblitz/sdk'

export type ShowCaseModule = {
  projectFiles: StackblitzSdk.ProjectFiles
  projectOptions: StackblitzSdk.EmbedOptions
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
      'stackblitz_host0',
      {
        template: 'node',
        files: module.projectFiles,
        title: 'SDK Test',
      },
      {
        ...module.projectOptions,
        startScript: 'dev',
      }
    )
  }, [module])

  return (
    <div style={{ height: '60vw', display: 'flex', alignItems: 'stretch' }}>
      <div id="stackblitz_host0" />
    </div>
  )
}
