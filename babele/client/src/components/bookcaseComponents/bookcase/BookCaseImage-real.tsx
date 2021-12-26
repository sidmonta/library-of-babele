import React from 'react'
import './BookCase.css'
import styled from "styled-components"

import Svg from '../../../img/books-bg'

const Bookcase = styled.div<{svg: string}>`
  width: 300px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #7FFFD3;
  background-image: url("${props => Svg[props.svg]}");
  p {
    display: block;
    margin: 1em 0;
    &.dewey {
      font-size: small;
    }
  }
`

const BookcaseLabel = styled.div`
  border-radius: 50%;
  background-color: #7FFFD3b0;
  padding: 15px;
`

export default function BookCaseImage({ label, dewey }: { label: string; dewey: string }) {
  const num = 3 - dewey.length
  const suffix = num > 0 ? (new Array(num).fill('0')).join('') : ''
  return (
    <Bookcase svg={dewey[0]}>
      <BookcaseLabel>
        <p className={'label'}>{label}</p>
        <p className={'dewey'}>{dewey}{suffix}</p>
      </BookcaseLabel>
    </Bookcase>
  )
}
