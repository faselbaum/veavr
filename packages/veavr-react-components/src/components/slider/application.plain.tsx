import { useSliderState } from './demo.shared.js'
import { Slider } from './component.js'

export const Application = () => {
  const { imgUrls, ticks } = useSliderState()

  return <Slider imgUrls={imgUrls} offset={ticks} />
}
