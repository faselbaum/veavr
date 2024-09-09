import * as React from 'react'

export type Props = {
  img?: string
  title?: string
  body?: React.ReactNode
  variant?: 'small' | 'medium'
}

export type State = {
  title: () => string
  variant: () => Exclude<Props['variant'], undefined>
}
