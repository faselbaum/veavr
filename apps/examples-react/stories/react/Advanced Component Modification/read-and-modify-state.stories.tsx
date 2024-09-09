import { Meta, StoryFn } from '@storybook/react'

import { RenderCard } from '@veavr/react-components/components/card-veave-state.js'

import CardSourceCode from '../../../../../packages/veavr-react-components/src/components/card-veave-state.tsx?raw'
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
