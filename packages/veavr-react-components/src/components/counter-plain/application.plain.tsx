import * as React from 'react'
import { Counter } from './component.js'

export const Application = () => {
  const [count, setCount] = React.useState(0)

  return (
    <Counter
      count={count}
      onIncrease={() => setCount(count + 1)}
      onDecrease={() => setCount(count - 1)}
    ></Counter>
  )
}
