import { Meta, StoryFn } from '@storybook/react'

import * as CardApplicationPlain from '@veavr/react-components/components/card/application.plain.js'

import ComponentSourceCode from '../../../../../packages/veavr-react-components/src/components/card/component.tsx?raw'

export default {} satisfies Meta

export const CardStory: StoryFn = () => <CardApplicationPlain.Application />
CardStory.parameters = {
  docs: {
    source: {
      code: ComponentSourceCode,
    },
  },
}
