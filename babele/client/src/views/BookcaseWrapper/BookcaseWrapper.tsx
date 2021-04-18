import React, { useEffect, useState } from 'react'
import BookCase, { BookCaseType } from '../../components/bookcaseComponents/bookcase/BookCase'
import styled from 'styled-components'

const BookCasesContainer = styled.div`
  width: 100vw;
  display: flex;
  overflow-y: scroll;
`

export default function BookcaseWrapper({
  category,
  onChange,
}: {
  category?: string
  onChange?: (bc: BookCaseType) => void
}) {
  const [bookcases, setBookCase] = useState<BookCaseType[]>([])
  // const [books, setBooks] = useState<string[]>([])

  const fetchData = (dewey?: string) => {
    const apiUrl = dewey ? `children/${dewey}` : 'init'
    const fetchData = async () => {
      const initialBookcases = await fetch(
        `http://${process.env.REACT_APP_HTTP_HOST}:${process.env.REACT_APP_HTTP_PORT}/api/${apiUrl}`
      ).then((data) => data.json())
      setBookCase(initialBookcases)
    }
    fetchData().then()
  }

  useEffect(() => {
    fetchData(category)
  }, [])

  const handleClick = (bc: BookCaseType) => {
    if (onChange) {
      onChange(bc)
    }
    // websocket.emit('BOOKLIST', {
    //   id: bc.dewey,
    // })
    //
    // websocket.on('BOOKLIST', function (payload: string) {
    //   console.log(books, payload)
    //   setBooks((books) => [...books, payload])
    // })
  }

  const printBookCases = () => {
    return bookcases.map((bc: BookCaseType) => <BookCase key={bc.dewey} {...bc} onClick={handleClick} />)
  }

  return <BookCasesContainer>{printBookCases()}</BookCasesContainer>
}
