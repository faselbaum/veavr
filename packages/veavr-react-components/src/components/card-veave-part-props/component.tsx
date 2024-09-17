import { Card as BaseCard } from '../card/component.js'

//           Card will be a new veavr component with our modifications
//           applying to all instances.
//           |
//           |              ˇ Call veave() on our veavr card component.
export const Card = BaseCard.veave()({
  component: ({ props, veavr }) => {
    // ˇ using the `bindProps` function gives us access to the `baseAssignedProps` object.
    return veavr.bindProps(({ baseAssignedProps }) => {
      // ˇ custom logic for the variant
      const variant =
        typeof props.img === 'string'
          ? // ˇ variant will always be medium if img prop is set
            'medium'
          : // ˇ otherwise keep default value from base component
            baseAssignedProps.Root.variant

      // ˇ return a new part props map.
      return {
        // ˇ copy assigned part property values from our predecessor.
        ...baseAssignedProps,
        Root: {
          ...baseAssignedProps.Root,
          variant,
        },
        Overlay: {
          // ˇ assign some css variables we know control the overlay visibility.
          style: {
            '--overlay-show': variant === 'small' ? '1fr' : undefined,
            '--overlay-gap': variant === 'small' ? '1' : undefined,
          },
        },
      }
    })
  },
})
