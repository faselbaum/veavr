import { Meta, StoryFn } from '@storybook/react'

import * as SliderApplicationPlain from '@veavr/react-components/components/slider/application.plain.js'
import * as SliderApplicationUniformOverride from '@veavr/react-components/components/slider/application.uniform-override.js'
import * as SliderApplicationConditionalOverride from '@veavr/react-components/components/slider/application.conditional-override.js'

import SliderApplicationPlainSourceCode from '../../../../packages/veavr-react-components/src/components/slider/application.plain.tsx?raw'
import SliderApplicationUniformOverrideSourceCode from '../../../../packages/veavr-react-components/src/components/slider/application.uniform-override.tsx?raw'
import SliderApplicationConditionalOverrideSourceCode from '../../../../packages/veavr-react-components/src/components/slider/application.conditional-override.tsx?raw'

export default {} satisfies Meta

export const PlainStory: StoryFn = () => <SliderApplicationPlain.Application />
PlainStory.parameters = {
  docs: {
    source: {
      code: SliderApplicationPlainSourceCode,
    },
  },
}

export const UniformOverrideStory: StoryFn = () => (
  <SliderApplicationUniformOverride.Application />
)
UniformOverrideStory.parameters = {
  docs: {
    source: {
      code: SliderApplicationUniformOverrideSourceCode,
    },
  },
}

export const ConditionalOverrideStory: StoryFn = () => (
  <SliderApplicationConditionalOverride.Application />
)
ConditionalOverrideStory.parameters = {
  docs: {
    source: {
      code: SliderApplicationConditionalOverrideSourceCode,
    },
  },
}
