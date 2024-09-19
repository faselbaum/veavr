import { Card as BaseCard } from '../card-veave-parts/component.js'
import { Props as BaseProps } from '../card/types.js'
import * as Parts from './parts.js'

export type CardProps = Omit<BaseProps, 'variant'> & {
  variant?: BaseProps['variant'] | 'large'
}

export const Card = BaseCard.veave<CardProps>()({
  parts: { Root: Parts.CustomRoot },
  prepareProps: (props) => ({
    ...props,
    variant: props.variant === 'large' ? 'medium' : props.variant,
  }),
  component: ({ props, veavr }) => {
    return veavr.bindProps(({ baseAssignedProps }) => {
      // ˇ custom logic for the variant
      const variant =
        typeof props.img === 'string'
          ? props.variant === 'medium' || props.variant === 'large'
            ? props.variant
            : baseAssignedProps.Root.variant
          : 'small'

      return {
        ...baseAssignedProps,
        Root: {
          ...baseAssignedProps.Root,
          variant,
        },
      }
    })
  },
})
