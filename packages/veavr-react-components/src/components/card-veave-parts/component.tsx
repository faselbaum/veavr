import { Card as BaseCard } from '../card-veave-state/component.js'
import * as Parts from './parts.js'

export const Card = BaseCard.veave()({
  parts: {
    Title: Parts.CustomTitle,
  },
  component: ({ veavr }) => {
    return veavr.bindProps(({ state, baseAssignedProps }) => ({
      ...baseAssignedProps,
      Title: {
        iconDirection: state.$overlayState === 'closed' ? 'up' : 'down',
      },
    }))
  },
})
