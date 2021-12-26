import React from 'react'
import { ThemeComponentFactory } from '../../../context/theme'
import { haveNewBooks } from '../../../store/books'
import { useRecoilValue } from 'recoil'
import BookCaseBadge from "../bookcasebadge/BookCaseBadge";

export interface BookCaseType {
  dewey: string
  name: string
  parent: string
  hierarchy: BookCaseType[]
  haveChildren: boolean
}

export interface BookCaseProps extends BookCaseType {
  onClick: (param: BookCaseType) => void
}

export default function BookCase(props: BookCaseProps) {
  const BookCaseImage = ThemeComponentFactory<{ label: string; dewey: string }>('bookcaseComponents/bookcase/BookCaseImage')
  const numNewBooks = useRecoilValue(haveNewBooks(props.dewey))

  const haveChildren = props.haveChildren || numNewBooks > 0

  return (
    <>
      <span
        className={haveChildren ? 'actionable' : 'non-actionable'}
        onClick={() => haveChildren && props.onClick(props)}
      >
        <BookCaseBadge number={numNewBooks} />
        <BookCaseImage label={props.name} dewey={props.dewey} />
      </span>
    </>
  )
}
