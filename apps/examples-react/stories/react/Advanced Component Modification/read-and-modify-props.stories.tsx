import { Meta, StoryFn } from '@storybook/react'

import { RenderCards } from '@weavr/react-components/components/card-weave-part-props.js'

import CardSourceCode from '../../../../../packages/weavr-react-components/src/components/card-weave-part-props.tsx?raw'
import { getCodeFromRegions } from '~/src/components/source-code'

export default {} satisfies Meta

export const CardStory: StoryFn = () => <RenderCards />
CardStory.parameters = {
  docs: {
    source: {
      code: getCodeFromRegions({
        code: CardSourceCode,
        regionNames: ['usage - render cards'],
        includeImports: false,
      }),
    },
  },
}
