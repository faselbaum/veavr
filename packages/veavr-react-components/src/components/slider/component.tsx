import { veavr } from '@veavr/react'

import * as Types from './types.js'
import * as Parts from './parts.js'

export const Slider = veavr<Types.Props>()({
  parts: Parts,
  component: ({ props, veavr }) => {
    return veavr
      .bindProps(() => ({
        TranslateContainer: {
          style: {
            '--offset-x': (props.offset % props.imgUrls.length).toString(),
          },
        },
        //   In this case the `Slide` entry is a props generator function
        //   which receives the `imgUrl` and `index` for the current step
        //   in the iteration. It can then return a props object for each
        //   item separately.
        //   ˇ
        Slide: (imgUrl: string, index: number) => ({
          src: imgUrl,
        }),
      }))
      .bindNode(({ parts, assignedProps }) => (
        <parts.Root {...assignedProps.Root}>
          <parts.TranslateContainer {...assignedProps.TranslateContainer}>
            {
              // Here we iterate over the `props.imgUrls` array
              // and map a `Slide` element to each item.
              //           ˇ
            }
            {props.imgUrls.map((imgUrl, index) => (
              //                            We call the props generator function registered
              //                            for the `Slide` part and provide it with the necessary
              //                            parameters.
              //                                  |
              // Then we spread the resulting     |
              // props to the individual `Slide`  |
              // part.ˇ                           |
              <parts.Slide {...assignedProps.Slide(imgUrl, index)} />
            ))}
          </parts.TranslateContainer>
        </parts.Root>
      ))
  },
})
