import { Meta, StoryFn } from '@storybook/react'

import CounterSourceCode from '../../../../packages/veavr-react-components/src/components/counter.tsx?raw'
import CounterVeavrSourceCode from '../../../../packages/veavr-react-components/src/components/counter-veavr.tsx?raw'

import * as Counter from '@veavr/react-components/components/counter.js'
import * as CounterVeavr from '@veavr/react-components/components/counter-veavr.js'
import { getCodeFromRegions } from '~/src/components/source-code'

export default {} satisfies Meta

export const CounterStory: StoryFn = () => {
  return <Counter.Application />
}
CounterStory.parameters = {
  docs: {
    source: {
      code: getCodeFromRegions({
        code: CounterSourceCode,
        regionNames: ['usage'],
        includeImports: false,
      }),
    },
  },
}

export const CounterVeavrStory: StoryFn = () => {
  return <CounterVeavr.Application />
}
CounterVeavrStory.parameters = {
  docs: {
    source: {
      code: getCodeFromRegions({
        code: CounterVeavrSourceCode,
        regionNames: ['usage'],
        includeImports: false,
      }),
    },
  },
}
