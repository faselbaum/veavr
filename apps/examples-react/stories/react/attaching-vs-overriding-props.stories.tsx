import { Meta, StoryFn } from '@storybook/react'

import CardApplicationAttachPropsSourceCode from '../../../../packages/veavr-react-components/src/components/card/application.attach-props.tsx?raw'
import CardApplicationOverridePropsSourceCode from '../../../../packages/veavr-react-components/src/components/card/application.override-props.tsx?raw'

import * as CardApplicationAttachProps from '@veavr/react-components/components/card/application.attach-props.js'
import * as CardApplicationOverrideProps from '@veavr/react-components/components/card/application.override-props.js'

export default {} satisfies Meta

export const AttachPropsStory: StoryFn = () => (
  <CardApplicationAttachProps.Application />
)
AttachPropsStory.parameters = {
  docs: {
    source: {
      code: CardApplicationAttachPropsSourceCode,
    },
  },
}

export const OverridePropsStory: StoryFn = () => (
  <CardApplicationOverrideProps.Application />
)
OverridePropsStory.parameters = {
  docs: {
    source: {
      code: CardApplicationOverridePropsSourceCode,
    },
  },
}
