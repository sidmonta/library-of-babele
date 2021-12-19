import React from 'react'
import { Tools } from '@sidmonta/babelelibrary'
import * as he from 'he'
import { useLabel } from '../../../context/labeler'
import { ThemeComponentFactory } from '../../../context/theme'
import { useRedirect } from '../../../services'
import { generateColorFromString } from '@sidmonta/babelelibrary/build/tools'


const Fallback = ({ url }: { url: string }) => (
  <div style={{ width: '150px', height: '200px', backgroundColor: Tools.generateColorFromString(url) }}>{url}</div>
)

export default function AtomBook({ url }: { url: string }) {
  const routeTo = useRedirect()

  const label: string = useLabel(url)[0] as string
  const BookCover = ThemeComponentFactory<{ color: string }>('bookComponents/book/AtomBook', <Fallback url={url} />)

  const bookColor = generateColorFromString(url)

  return (
    <div onClick={() => routeTo(url)} className="wid100" color={bookColor}>
      <BookCover color={bookColor}>{he.decode(label)}</BookCover>
    </div>
  )
}
