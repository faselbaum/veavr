import { Meta, StoryFn } from '@storybook/react'

import CounterSourceCode from '../../../../packages/weavr-react-components/src/components/counter.tsx?raw'
import CounterWeavrSourceCode from '../../../../packages/weavr-react-components/src/components/counter-weavr.tsx?raw'

import * as Counter from '@weavr/react-components/components/counter.js'
import * as CounterWeavr from '@weavr/react-components/components/counter-weavr.js'
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

export const CounterWeavrStory: StoryFn = () => {
  return <CounterWeavr.Application />
}
CounterWeavrStory.parameters = {
  docs: {
    source: {
      code: getCodeFromRegions({
        code: CounterWeavrSourceCode,
        regionNames: ['usage'],
        includeImports: false,
      }),
    },
  },
}
