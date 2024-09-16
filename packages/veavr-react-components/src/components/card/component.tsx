import { veavr } from '@veavr/react'

import * as Parts from './parts.js'
import * as Types from './types.js'

export const Card = veavr<Types.Props>()({
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
