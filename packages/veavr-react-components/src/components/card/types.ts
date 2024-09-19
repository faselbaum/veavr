import * as React from 'react'

export type Props = {
  img?: string
  title?: string
  body?: React.ReactNode
  variant?: 'small' | 'medium'
}

export const defaultProps: Props = {
  img: 'https://picsum.photos/800/600',
  title: 'Awesome Card',
  body: "I'm a veavr component ready to be customized.",
}
