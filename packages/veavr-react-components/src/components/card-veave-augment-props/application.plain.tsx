import { Card } from './component.js'

export const Application = () => (
  <>
    <Card
      variant="large"
      img="https://picsum.photos/800/600"
      title="New Variant! Large!"
      body={`A new, never before seen, size variant? Amazing!`}
    />
    <Card
      variant="medium"
      img="https://picsum.photos/800/600"
      title="Medium"
      body={`The standard medium variant.`}
    />
    <Card variant="small" title="Small" body={`The standard small variant.`} />
  </>
)
