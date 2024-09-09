//#region imports

import { Card as BaseCard } from './card.js'

//#endregion

//#region component

//           Card will be a new weavr component with our modifications
//           applying to all instances.
//           |
//           |              ˇ Call weave() on our weavr card component.
export const Card = BaseCard.weave()({
  component: ({ props, weavr }) => {
    // ˇ using the `bindProps` function gives us access to the `baseAssignedProps` object.
    return weavr.bindProps(({ baseAssignedProps }) => {
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

//#endregion

//#region usage - render cards

export const RenderCards = () => (
  <>
    <Card variant="small" title="Small Variant" body="I am now always open" />
    <Card
      variant="small"
      img="https://picsum.photos/800/600"
      title="Medium Variant"
      body={`I have the medium variant even though 'small' is passed to the variant prop.
        There's just not enough space for an image on small cards. 
        Also my overlay functions as before.`}
    />
  </>
)

//#endregion
