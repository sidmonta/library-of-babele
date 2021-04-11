import React from 'react'
import { ThemeComponentFactory } from '../../context/theme'
import { haveNewBooks } from '../../store/books'
import { useRecoilValue } from 'recoil'

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
  const BookCaseImage = ThemeComponentFactory<{ label: string; dewey: string }>('bookcase/BookCaseImage')
  const Badge = ThemeComponentFactory('bookcase/BookCaseBadge')
  const numNewBooks = useRecoilValue(haveNewBooks(props.dewey))
  return (
    <>
      <span
        className={props.haveChildren ? 'actionable' : ''}
        onClick={() => props.haveChildren && props.onClick(props)}
      >
        <Badge>{numNewBooks}</Badge>
        <BookCaseImage label={props.name} dewey={props.dewey} />
      </span>
    </>
  )
}