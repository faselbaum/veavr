import { defaultProps } from './showcase-common.js'
import { Card } from './component.js'

export const Application = () => {
  return (
    <>
      <Card
        // ˇ img is set
        img={defaultProps.img}
        title="Attach"
        body="My image is still intact"
        //                        image should still be intact,
        //                        even if we set it to undefined here
        //                        ˇ
        $vvr={{ attach: { Root: { imgUrl: undefined } } }}
      />
      <Card
        // ˇ img is set
        img={defaultProps.img}
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
