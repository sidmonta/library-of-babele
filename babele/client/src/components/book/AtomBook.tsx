import React from 'react'
import { Tools } from '@sidmonta/babelelibrary'
import * as he from 'he'
import { useLabel } from '../../context/labeler'
import { ThemeComponentFactory } from '../../context/theme'
import { useRedirect } from '../../services'
import { generateColorFromString } from '@sidmonta/babelelibrary/build/tools'

const Fallback = ({ url }: { url: string }) => (
  <div style={{ width: '150px', height: '200px', backgroundColor: Tools.generateColorFromString(url) }}>{url}</div>
)

export default function AtomBook({ url }: { url: string }) {
  const routeTo = useRedirect()

  const label: string = useLabel(url)[0] as string
  const BookCover = ThemeComponentFactory<{ color: string }>('book/AtomBook', <Fallback url={url} />)

  return (
    <div onClick={() => routeTo(url)}>
      <BookCover color={generateColorFromString(url)}>{he.decode(label)}</BookCover>
    </div>
  )
}
