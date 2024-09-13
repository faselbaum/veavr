import * as React from 'react'

import * as Types from './types.js'
import { Card } from './component.js'

export const defaultProps: Types.Props = {
  img: 'https://picsum.photos/800/600',
  title: 'Awesome Card',
  body: "I'm a veavr component ready to be customized.",
}

export const Application = () => <Card {...defaultProps} />
