import * as React from 'react'
import * as StackblitzSdk from '@stackblitz/sdk'
import * as StackblitzProjects from '../stackblitz-projects/@veavr/react-components/src/components/card/usage-plain.project.generated'

export const StackBlitzDevEnv: React.FunctionComponent = () => {
  React.useEffect(() => {
    StackblitzSdk.default.embedProject(
      'stackblitz_host0',
      {
        template: 'node',
        files: StackblitzProjects.projectFiles,
        title: 'SDK Test',
      },
      {
        ...StackblitzProjects.projectOptions,
        startScript: 'dev',
      }
    )
  }, [])

  return (
    <div style={{ height: '60vw', display: 'flex', alignItems: 'stretch' }}>
      <div id="stackblitz_host0" />
    </div>
  )
}
