//#region imports

import * as React from 'react'
import { Card as BaseCard } from './card-veave-part-props.js'

//#endregion

//#region component

export type State = {
  $overlayState: 'open' | 'closed'
  $setOverlayState: React.Dispatch<React.SetStateAction<State['$overlayState']>>
  toggleOverlayState: () => void
}

export const Card = BaseCard.veave()({
  component: ({ props, veavr }) => {
    const [$overlayState, $setOverlayState] =
      React.useState<State['$overlayState']>('closed')

    return veavr
      .bindState<State>(({ baseState }) => {
        return {
          $overlayState,
          $setOverlayState,
          toggleOverlayState: (s) =>
            s.$setOverlayState(
              s.$overlayState === 'closed' ? 'open' : 'closed'
            ),
        }
      })
      .bindProps(({ state, baseAssignedProps }) => ({
        ...baseAssignedProps,
        Overlay: {
          ...baseAssignedProps.Overlay,
          onClick: state.toggleOverlayState.bind(undefined, state),
          style: {
            '--overlay-gap':
              baseAssignedProps.Overlay.style['--overlay-gap'] ??
              (state.$overlayState === 'closed' ? '0' : '1'),
            '--overlay-show':
              baseAssignedProps.Overlay.style['--overlay-show'] ??
              (state.$overlayState === 'closed' ? '0fr' : '1fr'),
          },
        },
      }))
  },
})

//#endregion

//#region usage - render card

export const RenderCard = () => (
  <Card
    variant="small"
    img="https://picsum.photos/800/600"
    title="Click me!"
    body={`I won't open or close anymore unless you click the overlay.`}
  />
)

//#endregion
