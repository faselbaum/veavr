import { Props as CardProps } from './types.js'

export const SIZE_MULTIPLIERS = {
  small: 1,
  medium: 1.25,
} satisfies Record<Exclude<CardProps['variant'], undefined>, number>

export type RootProps = {
  variant: Exclude<CardProps['variant'], undefined>
  imgUrl?: string
}
