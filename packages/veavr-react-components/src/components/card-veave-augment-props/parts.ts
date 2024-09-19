import styled from '@emotion/styled'
import { css } from '@emotion/react'

import * as BaseParts from '../card/parts.js'
import * as BasePartTypes from '../card/parts.types.js'

export const CustomRootSizeMultipliers = {
  ...BasePartTypes.SIZE_MULTIPLIERS,
  large: 1.5,
} satisfies Record<CustomRootProps['variant'], number>

export type CustomRootProps = Omit<BasePartTypes.RootProps, 'variant'> & {
  variant: BasePartTypes.RootProps['variant'] | 'large'
}

export const CustomRoot = styled(BaseParts.Root)`
  ${(props: CustomRootProps) => css`
    width: calc(256px * ${CustomRootSizeMultipliers[props.variant]});
    min-width: calc(256px * ${CustomRootSizeMultipliers[props.variant]});
    height: calc(320px * ${CustomRootSizeMultipliers[props.variant]});
  `}
` as ReturnType<typeof styled.div<CustomRootProps>>
