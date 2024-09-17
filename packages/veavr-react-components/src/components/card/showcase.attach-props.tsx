import * as React from 'react'

import { defaultProps } from './showcase-common.js'

// ˇ veavr component
import { Card } from './component.js'

export const Application = () => {
  const [clicks, setClicks] = React.useState(0)

  return (
    <Card
      {...defaultProps}
      title="Click Me!"
      body={`You clicked me ${clicks} times`}
      $vvr={{
        attach: {
          Root: {
            onClick: () => setClicks(clicks + 1),
          },
        },
      }}
    />
  )
}
