import { Source } from '@storybook/blocks'
import * as React from 'react'

export type SourceCodeProps = GetCodeFromRegionsArgs

export const SourceCode = (props: SourceCodeProps) => {
  return (
    <Source
      language="tsx"
      dark={true}
      code={getCodeFromRegions(props)}
    ></Source>
  )
}

export type GetCodeFromRegionsArgs = {
  code: string
  includeImports?: boolean
  regionNames?: string[]
}

export function getCodeFromRegions({
  code,
  includeImports = true,
  regionNames: regionNamesIn = [],
}: GetCodeFromRegionsArgs): string {
  const regionNames = [
    ...(includeImports && regionNamesIn.length > 0 ? ['imports'] : []),
    ...regionNamesIn,
  ]
  let resultCode = regionNames.length === 0 ? code : ''

  if (regionNames.length > 0) {
    for (const regionName of regionNames) {
      resultCode = `${resultCode}\n\n${getCodeFromRegion(code, regionName)}`
    }
  }

  return resultCode
}

function getCodeFromRegion(code: string, regionName: string): string {
  const regex = new RegExp(
    `(?<beginregion>\\/\\/\\s*#region\\s*((${regionName}.*?)$)){1}(\\n*)(?<code>.*?)(\\n*)(?<endregion>\\/\\/\\s*#endregion){1}`,
    'ims'
  )

  return code.match(regex)?.groups?.code ?? ''
}
