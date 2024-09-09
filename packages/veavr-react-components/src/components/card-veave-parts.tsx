//#region imports

import { Card as BaseCard } from './card-veave-state.js'
import * as BaseParts from './card/parts.js'
import styled from '@emotion/styled'

//#endregion

//#region custom title

export const TitleRoot = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  cursor: pointer;
`

export const TitleIcon = styled.div<Pick<CustomTitleProps, 'iconDirection'>>`
  display: flex;
  align-items: center;

  padding-right: 10px;

  color: white;
  filter: drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.5));

  > svg {
    width: 20px;
    transition: transform 0.25s ease;
    transform: rotate(
      ${(props) => (props.iconDirection === 'up' ? 0 : '-180deg')}
    );
  }
`

export type CustomTitleProps = {
  children?: React.ReactNode
  iconDirection: 'up' | 'down'
}

export const CustomTitle: React.FunctionComponent<CustomTitleProps> = (
  props
) => {
  return (
    <TitleRoot>
      <BaseParts.Title>{props.children}</BaseParts.Title>
      <TitleIcon iconDirection={props.iconDirection}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{ fill: 'currentcolor' }}
          viewBox="0 0 512 512"
        >
          {/* <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--> */}
          <path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" />
        </svg>
      </TitleIcon>
    </TitleRoot>
  )
}

//#endregion

//#region component

export const Card = BaseCard.veave()({
  parts: {
    Title: CustomTitle,
  },
  component: ({ veavr }) => {
    return veavr.bindProps(({ state, baseAssignedProps }) => ({
      ...baseAssignedProps,
      Title: {
        iconDirection: state.$overlayState === 'closed' ? 'up' : 'down',
      },
    }))
  },
})

//#endregion

//#region usage - render card

export const RenderCard = () => (
  <Card
    variant="small"
    img="https://picsum.photos/800/600"
    title="Wow, New Icon!"
    body={`This part didn't exist before.`}
  />
)

//#endregion
