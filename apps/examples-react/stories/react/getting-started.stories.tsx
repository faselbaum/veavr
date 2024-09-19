import { Meta, StoryFn } from '@storybook/react'

import CounterPlainApplicationSourceCode from '../../../../packages/veavr-react-components/src/components/counter-plain/application.plain?raw'
import CounterApplicationSourceCode from '../../../../packages/veavr-react-components/src/components/counter/application.plain?raw'

import * as CounterPlain from '@veavr/react-components/components/counter-plain/application.plain.js'
import * as Counter from '@veavr/react-components/components/counter/application.plain.js'
export default {} satisfies Meta

export const CounterStory: StoryFn = () => {
  return <CounterPlain.Application />
}
CounterStory.parameters = {
  docs: {
    source: {
      code: CounterPlainApplicationSourceCode,
    },
  },
}

export const CounterVeavrStory: StoryFn = () => {
  return <Counter.Application />
}
CounterVeavrStory.parameters = {
  docs: {
    source: {
      code: CounterApplicationSourceCode,
    },
  },
}
