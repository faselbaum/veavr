import { Meta, StoryFn } from '@storybook/react'

import { RenderCard } from '@weavr/react-components/components/card-weave-augment-props.js'

import CardSourceCode from '../../../../../packages/weavr-react-components/src/components/card-weave-augment-props.tsx?raw'
import { getCodeFromRegions } from '~/src/components/source-code'

export default {} satisfies Meta

export const CardStory: StoryFn = () => <RenderCard />
CardStory.parameters = {
  docs: {
    source: {
      code: getCodeFromRegions({
        code: CardSourceCode,
        regionNames: ['usage - render card'],
        includeImports: false,
      }),
    },
  },
}
