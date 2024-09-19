import * as React from 'react'

import { Counter } from './component.js'

export const Application = () => {
  const [count, setCount] = React.useState(0)

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setCount(
      Number.isInteger(event.target.valueAsNumber)
        ? event.target.valueAsNumber
        : 0
    )
  }

  return (
    <div>
      <label htmlFor="counter-input">Count Label</label>
      <Counter
        count={count}
        onIncrease={() => setCount(count + 1)}
        onDecrease={() => setCount(count - 1)}
        // all veaver components have this special $vvr prop.
        // it allows for simple assignment of values to props on component internal parts.
        // ˇ
        $vvr={{
          // note: there's also an `override` prop.
          // the difference will be showcased in other sections of the docs.
          // ˇ
          attach: {
            // ˇ the name of the part to attach props to.
            Input: {
              // ˇ the props to attach.
              id: 'counter-input',
              onChange: handleChange,
            },
          },
        }}
      ></Counter>
    </div>
  )
}
