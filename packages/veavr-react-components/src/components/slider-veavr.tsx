//#region imports

import * as React from 'react'
import styled from '@emotion/styled'
import { veavr } from '@veavr/react'

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
  max-width: 50%;
`

export const Parts = {
  Slide,
  Root,
  TranslateContainer,
}

//#endregion

//#region component

export type VeavrSliderProps = {
  imgUrls: string[]
  offset: number
}

export const VeavrSlider = veavr<VeavrSliderProps>()({
  parts: Parts,
  component: ({ props, veavr }) => {
    return veavr
      .bindProps(() => ({
        TranslateContainer: {
          style: {
            '--offset-x': (props.offset % props.imgUrls.length).toString(),
          },
        },
        //   In this case the `Slide` entry is a props generator function
        //   which receives the `imgUrl` and `index` for the current step
        //   in the iteration. It can then return a props object for each
        //   item separately.
        //   ˇ
        Slide: (imgUrl: string, index: number) => ({
          src: imgUrl,
        }),
      }))
      .bindNode(({ parts, assignedProps }) => (
        <parts.Root {...assignedProps.Root}>
          <parts.TranslateContainer {...assignedProps.TranslateContainer}>
            {
              // Here we iterate over the `props.imgUrls` array
              // and map a `Slide` element to each item.
              //           ˇ
            }
            {props.imgUrls.map((imgUrl, index) => (
              //                            We call the props generator function registered
              //                            for the `Slide` part and provide it with the necessary
              //                            parameters.
              //                                  |
              // Then we spread the resulting     |
              // props to the individual `Slide`  |
              // part.ˇ                           |
              <parts.Slide {...assignedProps.Slide(imgUrl, index)} />
            ))}
          </parts.TranslateContainer>
        </parts.Root>
      ))
  },
})

//#endregion

function useSliderState() {
  const [ticks, setTicks] = React.useState(0)

  React.useEffect(() => {
    window.setTimeout(() => setTicks(ticks + 1), 2000)
  }, [ticks])

  const imgUrls = Array.from(Array(6)).map(
    (_, index) => `https://picsum.photos/800/600?random=${index}`
  )

  return { imgUrls, ticks }
}

//#region usage - render original

export const RenderOriginal = () => {
  const { imgUrls, ticks } = useSliderState()

  return <VeavrSlider imgUrls={imgUrls} offset={ticks} />
}

//#endregion

//#region usage - static override

export const StaticOverride = () => {
  const { imgUrls, ticks } = useSliderState()

  return (
    <VeavrSlider
      imgUrls={imgUrls}
      offset={ticks}
      $vvr={{
        override: {
          Slide: {
            style: {
              filter: 'invert(1)',
            },
          },
        },
      }}
    />
  )
}

//#endregion

//#region usage - conditional override

export const ConditionalOverride = () => {
  const { imgUrls, ticks } = useSliderState()

  return (
    <VeavrSlider
      imgUrls={imgUrls}
      offset={ticks}
      $vvr={{
        override: {
          Slide: (_, index) => ({
            style: {
              opacity: index % 2 !== 0 ? 0.5 : 1,
            },
          }),
          Root: {
            style: {
              background: 'rgb(255, 0, 85)',
            },
          },
        },
      }}
    />
  )
}

//#endregion
