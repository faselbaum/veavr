import * as React from 'react'

export function useSliderState() {
  const [ticks, setTicks] = React.useState(0)

  React.useEffect(() => {
    window.setTimeout(() => setTicks(ticks + 1), 2000)
  }, [ticks])

  const imgUrls = Array.from(Array(6)).map(
    (_, index) => `https://picsum.photos/800/600?random=${index}`
  )

  return { imgUrls, ticks }
}
