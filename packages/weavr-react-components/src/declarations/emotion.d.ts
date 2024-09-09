import '@emotion/react'
import { Theme as ThemeType } from '~/theme.js'

declare module '@emotion/react' {
  export interface Theme extends ThemeType {}
}
