//#region imports

import styled from '@emotion/styled'
import { Card as BaseCard } from './card-veave-parts.js'
import { Props as BaseProps } from './card/types.js'
import * as BaseParts from './card/parts.js'
import * as BasePartTypes from './card/parts.types.js'
import { css } from '@emotion/react'

//#endregion

//#region parts

export const CustomRootSizeMultipliers = {
  ...BasePartTypes.SIZE_MULTIPLIERS,
  large: 1.5,
} satisfies Record<CustomRootProps['variant'], number>

export type CustomRootProps = Omit<BasePartTypes.RootProps, 'variant'> & {
  variant: BasePartTypes.RootProps['variant'] | 'large'
}

const CustomRoot = styled(BaseParts.Root)`
  ${(props: CustomRootProps) => css`
    width: calc(256px * ${CustomRootSizeMultipliers[props.variant]});
    min-width: calc(256px * ${CustomRootSizeMultipliers[props.variant]});
    height: calc(320px * ${CustomRootSizeMultipliers[props.variant]});
  `}
` as ReturnType<typeof styled.div<CustomRootProps>>

//#endregion

//#region component

export type CardProps = Omit<BaseProps, 'variant'> & {
  variant?: BaseProps['variant'] | 'large'
}

export const Card = BaseCard.veave<CardProps>()({
  parts: { Root: CustomRoot },
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

//#endregion

//#region usage - render card

export const RenderCard = () => (
  <>
    <Card
      variant="large"
      img="https://picsum.photos/800/600"
      title="New Variant! Large!"
      body={`A new, never before seen, size variant? Amazing!`}
    />
    <Card
      variant="medium"
      img="https://picsum.photos/800/600"
      title="Medium"
      body={`The standard medium variant.`}
    />
    <Card variant="small" title="Small" body={`The standard small variant.`} />
  </>
)

//#endregion
