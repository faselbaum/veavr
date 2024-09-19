import { useSliderState } from './demo.shared.js'
import { Slider } from './component.js'

export const Application = () => {
  const { imgUrls, ticks } = useSliderState()

  return (
    <Slider
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
