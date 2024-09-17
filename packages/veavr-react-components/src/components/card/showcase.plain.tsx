import { defaultProps } from './showcase-common.js'

// ˇ veavr component
import { Card } from './component.js'

export const Application = () => {
  // ˇ here you can play with the `vvr` prop
  return <Card {...defaultProps} />
}
