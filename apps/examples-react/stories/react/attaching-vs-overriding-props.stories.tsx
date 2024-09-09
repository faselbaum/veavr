import * as React from 'react'
import { Meta, StoryFn } from '@storybook/react'

import CardSourceCode from '../../../../packages/weavr-react-components/src/components/card.tsx?raw'

import {
  Card,
  AttachProps,
  OverrideProps,
} from '@weavr/react-components/components/card.js'
import { getCodeFromRegions } from '~/src/components/source-code'

export default {} satisfies Meta

export const ComponentSourceStory: StoryFn = () => <></>
ComponentSourceStory.parameters = {
  docs: {
    source: {
      code: getCodeFromRegions({
        code: CardSourceCode,
        regionNames: ['component'],
      }),
    },
  },
}

export const AttachPropsStory: StoryFn = () => <AttachProps />
AttachPropsStory.parameters = {
  docs: {
    source: {
      code: getCodeFromRegions({
        code: CardSourceCode,
        regionNames: ['usage - attach props'],
        includeImports: false,
      }),
    },
  },
}

export const OverridePropsStory: StoryFn<typeof Card> = () => <OverrideProps />
OverridePropsStory.parameters = {
  docs: {
    source: {
      code: getCodeFromRegions({
        code: CardSourceCode,
        regionNames: ['usage - override props'],
        includeImports: false,
      }),
    },
  },
}
