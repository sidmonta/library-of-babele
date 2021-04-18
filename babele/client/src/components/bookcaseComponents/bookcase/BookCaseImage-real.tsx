import React from 'react'
import './BookCase.css'
import styled from "styled-components";

const Bookcase = styled.div`
  width: 300px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: aquamarine;

  p {
    display: block;
    margin: 1em 0;
    &.dewey {
      font-size: small;
    }
  }
`

export default function BookCaseImage({ label, dewey }: { label: string; dewey: string }) {
  const num = 3 - dewey.length
  const suffix = num > 0 ? (new Array(num).fill('0')).join('') : ''
  return (
    <Bookcase>
      <div>
        <p className={'label'}>{label}</p>
        <p className={'dewey'}>{dewey}{suffix}</p>
      </div>
    </Bookcase>
  )
}
