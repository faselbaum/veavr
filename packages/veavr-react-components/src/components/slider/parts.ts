import styled from '@emotion/styled'

export const Root = styled.div`
  position: relative;
  overflow: hidden;
  max-width: 50%;
`

export const TranslateContainer = styled.div<{
  style?: React.CSSProperties & { '--offset-x': string }
}>`
  display: flex;
  overflow: visible;

  width: 100%;

  transition: transform 0.25s ease;
  transform: translateX(calc(-1 * (var(--offset-x) * 100%)));
`

export const Slide = styled.img`
  min-width: 100%;
`
