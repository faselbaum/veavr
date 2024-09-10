**veavr**, build flexible ui components.

veavr is a library which helps you build highly customizable ui components featuring tight integration with TypeScript.

```
The project is still in it's early stages and should be treated as experimental.
As such veavr's API's and their documentation are not yet final.
You might encounter bugs or performance issues along the way.
If you still feel like giving it a try you're welcome.
```

# @veavr/react

This is the veavr library for react.

## Requirements

```json
"react": ">=17"
"typescript": ">=5.4"
```

**This package is provided as ESM only and as such requires**

- **Server**: an ESM + CJS compatible runtime with standard `react` **OR** the use of a bundler.
- **Client**: an ESM compatible runtime plus an ESM drop-in replacement of react, such as `https://esm.sh/react`,
  **OR** the use of a bundler

## Usage

### Implementing a component with veavr.

```jsx
import { veavr } from '@veavr/react'

import * as Parts from './parts.tsx'

export type CardProps = {
  img?: string
  title?: string
  body?: React.ReactNode
  variant?: 'small' | 'medium'
}

export const Card = veavr<CardProps>()({
  // ˇ parts is just a an object mapping names to react components
  parts: Parts,
  component: ({ props, veavr }) => {
    return veavr
      .bindProps(() => ({
        Root: {
          imgUrl: props.img,
          variant: props.variant ?? 'small',
        },
      }))
      .bindNode(({ parts, assignedProps }) => (
        <parts.Root {...assignedProps.Root}>
          <parts.Overlay {...assignedProps.Overlay}>
            <parts.Title {...assignedProps.Title}>{props.title}</parts.Title>
            <parts.Body {...assignedProps.Body}>{props.body}</parts.Body>
          </parts.Overlay>
        </parts.Root>
      ))
  },
})
Card.displayName = 'Card'
```

### Using a veavr component.

```jsx
export const App = () => {
  const [clicks, setClicks] = React.useState(0)

  return (
    <Card
      img="https://picsum.photos/800/600"
      title="Click Me!"
      body={`You clicked me ${clicks} times`}
      $vvr={{
        attach: {
          // ˇ Super powers! Attach any prop to any internal element.
          Root: {
            'aria-label': 'Card of The Century',
            onClick: () => setClicks(clicks + 1),
          },
        },
      }}
    />
  )
}
```

This is just a glimpse of what components built with veavr can do.
You can find the full documentation [Here](https://faselbaum.github.io/veavr).
