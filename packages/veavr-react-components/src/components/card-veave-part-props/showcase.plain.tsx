import { defaultProps } from '../card/showcase-common.js'
import { Card } from './component.js'

export const Application = () => (
  <>
    <Card variant="small" title="Small Variant" body="I am now always open" />
    <Card
      {...defaultProps}
      variant="small"
      title="Medium Variant"
      body={`I have the medium variant even though 'small' is passed to the variant prop.
        There's just not enough space for an image on small cards. 
        Also my overlay functions as before.`}
    />
  </>
)
