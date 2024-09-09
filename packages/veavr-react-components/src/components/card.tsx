//#region Imports

import * as React from 'react'
import { veavr } from '@veavr/react'

import * as Parts from './card/parts.js'
import * as Types from './card/types.js'

//#endregion

export const commonProps: Types.Props = {
  img: 'https://picsum.photos/800/600',
  title: 'Awesome Card',
  body: "I'm a veavr component ready to be customized.",
}

//#region component

export const Card = veavr<Types.Props>()({
  parts: Parts,
  component: ({ props, veavr }) => {
    return veavr
      .bindProps(() => ({
        Root: {
          imgUrl: props.img,
          variant: props.variant ?? 'small',
        },
      }))
      .bindNode(({ parts, assignedProps }) => (
        <parts.Root {...assignedProps.Root}>
          <parts.Overlay {...assignedProps.Overlay}>
            <parts.Title {...assignedProps.Title}>{props.title}</parts.Title>
            <parts.Body {...assignedProps.Body}>{props.body}</parts.Body>
          </parts.Overlay>
        </parts.Root>
      ))
  },
})
Card.displayName = 'Card'

//#endregion

//#region usage - render card

export const RenderCard = () => {
  return (
    <Card
      img="https://picsum.photos/800/600"
      title="Awesome Card"
      body="I'm a veavr component ready to be customized."
    />
  )
}

//#endregion

//#region usage - attach props

export const AttachProps = () => {
  const [clicks, setClicks] = React.useState(0)

  return (
    <div>
      <Card
        img="https://picsum.photos/800/600"
        title="Click Me!"
        body={`You clicked me ${clicks} times`}
        $vvr={{
          attach: {
            Root: {
              onClick: () => setClicks(clicks + 1),
            },
          },
        }}
      />
      <br></br>
      <div>You clicked the card {clicks} times.</div>
    </div>
  )
}

//#endregion

//#region usage - override props

export const OverrideProps = () => {
  return (
    <>
      <Card
        // ˇ img is set
        img="https://picsum.photos/800/600"
        title="Attach"
        body="My image is still intact"
        //                        image should still be intact,
        //                        even if we set it to undefined here
        //                        ˇ
        $vvr={{ attach: { Root: { imgUrl: undefined } } }}
      />
      <Card
        // ˇ img is set
        img="https://picsum.photos/800/600"
        title="Override"
        body="My image is broken!"
        //                        image is gone since the imgUrl prop,
        //                        of the Root part received a hard override
        //                        ˇ
        $vvr={{ override: { Root: { imgUrl: undefined } } }}
      />
    </>
  )
}

//#endregion
