import React, {createRef, useEffect, useState} from 'react'
import { useWebSocket, useWSData } from '../../../context/websocket'
import { DeweyCategory } from '@sidmonta/babelelibrary/build/types'
import BookList from '../booklist/BookList'
import BookLoader from "../../common/BookLoader";
import styled from "styled-components";

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
`

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
  const loaderDom = createRef<HTMLDivElement>()
  const [currentPage, setCurrentPage] = useState(0)

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

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.25
    };

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCurrentPage((prev) => prev + 1)
        }
      });
    }

    const observer = new IntersectionObserver(handleIntersect, options);
    if (loaderDom.current) {
      observer.observe(loaderDom.current);
    }

    return () => observer.disconnect()
  }, [loaderDom])

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
