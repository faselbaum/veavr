import { Meta, StoryFn } from '@storybook/react'

import * as SliderVeavr from '@veavr/react-components/components/slider-veavr.js'

import SliderVeavrSourceCode from '../../../../packages/veavr-react-components/src/components/slider-veavr.tsx?raw'
import { getCodeFromRegions } from '~/src/components/source-code'

export default {} satisfies Meta

export const SliderPartsStory: StoryFn = () => <>Show parts code.</>
SliderPartsStory.parameters = {
  docs: {
    source: {
      code: getCodeFromRegions({
        code: SliderVeavrSourceCode,
        regionNames: ['parts'],
      }),
    },
  },
}

export const RenderOriginalStory: StoryFn = () => <SliderVeavr.RenderOriginal />
RenderOriginalStory.parameters = {
  docs: {
    source: {
      code: getCodeFromRegions({
        code: SliderVeavrSourceCode,
        regionNames: ['usage - render original'],
        includeImports: false,
      }),
    },
  },
}

export const StaticOverrideStory: StoryFn = () => <SliderVeavr.StaticOverride />
StaticOverrideStory.parameters = {
  docs: {
    source: {
      code: getCodeFromRegions({
        code: SliderVeavrSourceCode,
        regionNames: ['usage - static override'],
        includeImports: false,
      }),
    },
  },
}

export const ConditionalOverrideStory: StoryFn = () => (
  <SliderVeavr.ConditionalOverride />
)
ConditionalOverrideStory.parameters = {
  docs: {
    source: {
      code: getCodeFromRegions({
        code: SliderVeavrSourceCode,
        regionNames: ['usage - conditional override'],
        includeImports: false,
      }),
    },
  },
}
