import { Card } from './component.js'

export const Application = () => (
  <Card
    variant="small"
    img="https://picsum.photos/800/600"
    title="Click me!"
    body={`I won't open or close anymore unless you click the overlay.`}
  />
)
