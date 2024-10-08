import * as React from 'react'

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
