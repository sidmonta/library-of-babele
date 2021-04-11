import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import WoodBookcase from '../../components/woodbookcase/WoodBookcase'
import BookList from '../../components/booklist/BookList'
import { useWebSocket, useWSData } from '../../context/websocket'

export default function SearchResult() {
  const { query } = useParams<{ query: string }>()
  const webSocketClient = useWebSocket()
  const [books, setBook] = useWSData<string>('BOOKSEARCH')

  useEffect(() => {
    if (query) {
      setBook([])
      webSocketClient.emit('BOOKSEARCH', { query })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])
  return (
    <div className="page-container">
      <WoodBookcase title={query || ''}>
        <div className="wood-book">
          <BookList books={books} />
        </div>
      </WoodBookcase>
    </div>
  )
}
