//#region imports

import * as React from 'react'
import { weavr } from '@weavr/react'

//#endregion

//#region component

type CounterProps = {
  count: number
  onIncrease: () => void
  onDecrease: () => void
}

//                          ˇ 1. your props type goes here
export const Counter = weavr<CounterProps>()({
  // ˇ 2. give names to internaly used components
  parts: {
    Root: 'div',
    Input: 'input',
    IncreaseButton: 'button',
    DecreaseButton: 'button',
  },
  component: ({ props, weavr }) => {
    return (
      weavr
        // ˇ 3. assign props to elements.
        .bindProps(() => ({
          Input: {
            value: props.count,
            type: 'number',
          },
          IncreaseButton: {
            onClick: props.onIncrease,
          },
          DecreaseButton: {
            onClick: props.onDecrease,
          },
        }))
        // ˇ 4. jsx render result
        .bindNode(({ parts, assignedProps }) => (
          <parts.Root {...assignedProps.Root}>
            <parts.Input {...assignedProps.Input}></parts.Input>
            <parts.IncreaseButton {...assignedProps.IncreaseButton}>
              +
            </parts.IncreaseButton>
            <parts.DecreaseButton {...assignedProps.DecreaseButton}>
              -
            </parts.DecreaseButton>
          </parts.Root>
        ))
    )
  },
})
Counter.displayName = 'Counter'

//#endregion

//#region usage

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
        // all weaver components have this special $wvr prop.
        // it allows for simple assignment of values to props on component internal parts.
        // ˇ
        $wvr={{
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

//#endregion
