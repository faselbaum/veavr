import * as StackblitzSdk from '@stackblitz/sdk'
import * as StackblitzProjects from '../stackblitz-projects/stackblitz.project.generated'

export const StackBlitzDevEnv: React.FunctionComponent = () => {
  const handleClick = () => {
    StackblitzSdk.default.embedProject(
      'stackblitz_host0',
      {
        template: 'node',
        files: StackblitzProjects.projectFiles,
        title: 'SDK Test',
      },
      {
        height: '100%',
        startScript: 'dev',
      }
    )
  }

  return (
    <>
      <div style={{ height: '60vw', display: 'flex', alignItems: 'stretch' }}>
        <div id="stackblitz_host0" />
      </div>
      <button onClick={handleClick}>Open Stackblitz</button>
    </>
  )
}
