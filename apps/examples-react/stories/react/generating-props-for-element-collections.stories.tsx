import { Meta, StoryFn } from '@storybook/react'

import { Render } from '@veavr/react-components/components/slider-veavr.js'

import SliderVeavrSourceCode from '../../../../packages/veavr-react-components/src/components/slider-veavr.tsx?raw'
import { getCodeFromRegions } from '~/src/components/source-code'

export default {} satisfies Meta

export const SliderVeavrStory: StoryFn = () => <Render />
SliderVeavrStory.parameters = {
  docs: {
    source: {
      code: getCodeFromRegions({
        code: SliderVeavrSourceCode,
        regionNames: ['usage - render'],
        includeImports: false,
      }),
    },
  },
}
