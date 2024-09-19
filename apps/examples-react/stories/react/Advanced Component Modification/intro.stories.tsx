import { Meta, StoryFn } from '@storybook/react'

import * as CardApplicationPlain from '@veavr/react-components/components/card/application.plain.js'

import CardApplicationPlainSourceCode from '../../../../../packages/veavr-react-components/src/components/card/application.plain.tsx?raw'

export default {} satisfies Meta

export const CardStory: StoryFn = () => <CardApplicationPlain.Application />
CardStory.parameters = {
  docs: {
    source: {
      code: CardApplicationPlainSourceCode,
    },
  },
}
