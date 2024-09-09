import { Meta, StoryFn } from '@storybook/react'

import { Render } from '@weavr/react-components/components/slider-weavr.js'

import SliderWeavrSourceCode from '../../../../packages/weavr-react-components/src/components/slider-weavr.tsx?raw'
import { getCodeFromRegions } from '~/src/components/source-code'

export default {} satisfies Meta

export const SliderWeavrStory: StoryFn = () => <Render />
SliderWeavrStory.parameters = {
  docs: {
    source: {
      code: getCodeFromRegions({
        code: SliderWeavrSourceCode,
        regionNames: ['usage - render'],
        includeImports: false,
      }),
    },
  },
}
