import { veavr } from '@veavr/react'

type CounterProps = {
  count: number
  onIncrease: () => void
  onDecrease: () => void
}

//                          ˇ 1. your props type goes here
export const Counter = veavr<CounterProps>()({
  // ˇ 2. give names to internaly used components
  parts: {
    Root: 'div',
    Input: 'input',
    IncreaseButton: 'button',
    DecreaseButton: 'button',
  },
  component: ({ props, veavr }) => {
    return (
      veavr
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
