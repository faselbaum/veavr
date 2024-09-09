//#region imports

import * as React from 'react'

//#endregion

//#region component

type CounterProps = {
  count: number
  onIncrease: () => void
  onDecrease: () => void
}

export const Counter: React.FunctionComponent<CounterProps> = (props) => (
  <div>
    <input type="number" value={props.count}></input>
    <button onClick={props.onIncrease}>+</button>
    <button onClick={props.onDecrease}>-</button>
  </div>
)
Counter.displayName = 'Counter'

//#endregion

//#region usage

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

//#endregion
