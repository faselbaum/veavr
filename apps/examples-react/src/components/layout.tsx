import styled from '@emotion/styled'

export const StoryLayout = styled.div<{ 'min-width'?: string }>`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(${(props) => props['min-width'] ?? '320px'}, 1fr)
  );
  gap: 32px;

  justify-items: center;
  align-items: end;
`
