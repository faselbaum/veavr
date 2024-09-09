//#region imports

import * as React from 'react'
import styled from '@emotion/styled'
import { weavr } from '@weavr/react'

//#endregion

//#region parts

export const Slide = styled.img`
  min-width: 100%;
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

export const Root = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
`

export const Parts = {
  Slide,
  Root,
  TranslateContainer,
}

//#endregion

//#region component

export type WeavrSliderProps = {
  imgUrls: string[]
  offset: number
}

export const WeavrSlider = weavr<WeavrSliderProps>()({
  parts: Parts,
  component: ({ props, weavr }) => {
    return weavr
      .bindProps(() => ({
        TranslateContainer: {
          style: {
            '--offset-x': (props.offset % props.imgUrls.length).toString(),
          },
        },
        Slide: (imgUrl: string, index: number) => ({
          src: imgUrl,
        }),
      }))
      .bindNode(({ parts, assignedProps }) => (
        <parts.Root {...assignedProps.Root}>
          <parts.TranslateContainer {...assignedProps.TranslateContainer}>
            {props.imgUrls.map((imgUrl, index) => (
              <parts.Slide {...assignedProps.Slide(imgUrl, index)} />
            ))}
          </parts.TranslateContainer>
        </parts.Root>
      ))
  },
})

//#endregion

//#region usage - render

export const Render = () => {
  const [ticks, setTicks] = React.useState(0)

  React.useEffect(() => {
    window.setTimeout(() => setTicks(ticks + 1), 2000)
  }, [ticks])

  const imgUrls = [
    'https://picsum.photos/800/600?random=1',
    'https://picsum.photos/800/600?random=2',
    'https://picsum.photos/800/600?random=3',
    'https://picsum.photos/800/600?random=4',
    'https://picsum.photos/800/600?random=5',
  ]

  return (
    <>
      <div style={{ width: '100%' }}>
        <WeavrSlider imgUrls={imgUrls} offset={ticks} />
        <p>Original</p>
      </div>
      <div style={{ width: '100%' }}>
        <WeavrSlider
          imgUrls={imgUrls}
          offset={ticks}
          $wvr={{
            override: {
              Slide: {
                style: {
                  filter: 'invert(1)',
                },
              },
            },
          }}
        />
        <p>Every slide is inverted</p>
      </div>
      <div style={{ width: '100%' }}>
        <WeavrSlider
          imgUrls={imgUrls}
          offset={ticks}
          $wvr={{
            override: {
              Slide: (_, index) => ({
                style: {
                  filter: index % 2 !== 0 ? 'grayscale(1)' : undefined,
                },
              }),
            },
          }}
        />
        <p>Every 2nd slide is grayscale</p>
      </div>
    </>
  )
}

//#endregion
