import { Meta, StoryFn } from '@storybook/react'

import * as ApplicationPlain from '@veavr/react-components/components/card-veave-part-props/application.plain.js'

import ApplicationPlainSourceCode from '../../../../../packages/veavr-react-components/src/components/card-veave-part-props/application.plain.tsx?raw'

export default {} satisfies Meta

export const CardStory: StoryFn = () => <ApplicationPlain.Application />
CardStory.parameters = {
  docs: {
    source: {
      code: ApplicationPlainSourceCode,
    },
  },
}
