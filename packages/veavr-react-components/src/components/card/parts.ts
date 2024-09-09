import styled from '@emotion/styled'
import * as Types from './parts.types.js'

export const Root = styled.div<Types.RootProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: calc(256px * ${(props) => Types.SIZE_MULTIPLIERS[props.variant]});
  min-width: calc(256px * ${(props) => Types.SIZE_MULTIPLIERS[props.variant]});
  height: calc(320px * ${(props) => Types.SIZE_MULTIPLIERS[props.variant]});
  overflow: hidden;

  background-image: url(${(props) => props.imgUrl});
  background-size: cover;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 4px 8px -4px;
  border-radius: ${(props) => props.theme['border-radius']};

  :hover {
    --overlay-show: 1fr;
    --overlay-gap: 1;
  }
`
export const Title = styled.p`
  font-family: 'Playwrite CU', cursive;
  font-optical-sizing: auto;
  font-weight: 200;
  font-style: normal;
  line-height: 1.8em;

  font-size: 18px;
  grid-column: start / end;
  grid-row: title-start / title-end;

  padding: 6px 0 6px 0;
`

export const Body = styled.div`
  font-family: 'Roboto Slab', serif;
  font-optical-sizing: auto;
  font-style: normal;

  font-size: 16px;
  font-weight: 200;
  line-height: 20px;

  grid-column: start / end;
  grid-row: body-start / end-end;
  overflow: hidden auto;
`

export const Overlay = styled.div<{
  style?: React.CSSProperties &
    Partial<Record<'--overlay-show' | '--overlay-gap', string>>
}>`
  display: grid;
  grid-template-columns: [start] auto [end];
  grid-template-rows:
    [title-start] min-content [title-end body-start] var(--overlay-show, 0fr)
    [body-end];
  gap: calc(var(--overlay-gap, 0) * 16px);
  padding: 12px;
  overflow: hidden hidden;
  flex-grow: var(--overlay-gap, 0);
  margin-top: auto;

  transition: grid-template-rows 0.25s ease;
  transition-property: grid-template-rows, gap, flex-grow, max-height;

  background: white;
`
