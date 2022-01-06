import React, {useEffect} from 'react'
import { useWebSocket, useWSData } from '../../../context/websocket'
import { DeweyCategory } from '@sidmonta/babelelibrary/build/types'
import BookList from '../booklist/BookList'
import BookLoader from "../../common/BookLoader";
import styled from "styled-components";
import {LoaderContainer} from "../../common/structure";
import {useInterceptionPagination} from "../../../services";

const SummaryInfo = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: small;

  strong {
    margin-left: 3px;
  }

`

export default function WrapBookList({ deweySelect }: { deweySelect: DeweyCategory | null }) {
  const webSocketClient = useWebSocket()
  const deweyId = deweySelect?.dewey
  const [books, setBooks] = useWSData<{book: string, totItems: number}>('BOOKLIST_' + deweyId)
  const [loaderDom, currentPage, setCurrentPage] = useInterceptionPagination({ data: books, numElem: 10 })

  useEffect(() => {
    // Nuovo dewey da visualizzare
    if (deweyId) {
      setBooks([])
      setCurrentPage(0)
    }
  }, [deweyId, setBooks, setCurrentPage])

  useEffect(() => {
    if (deweyId) {
      webSocketClient.emit('BOOKLIST', {
        id: deweyId,
        page: currentPage
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deweyId, currentPage])

  return (
    <div>
      <SummaryInfo>
        {books.length} / <strong>{books[0]?.totItems}</strong>
      </SummaryInfo>

      <BookList books={books.map(({book}) => book)} />
      <LoaderContainer ref={loaderDom}>
        {books.length < books[0]?.totItems && <BookLoader color={'#55786a'} size={0.3} />}
      </LoaderContainer>
    </div>
  )
}
