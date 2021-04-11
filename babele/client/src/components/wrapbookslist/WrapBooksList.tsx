import React, { useEffect } from 'react'
import { useWebSocket, useWSData } from '../../context/websocket'
import { DeweyCategory } from '@sidmonta/babelelibrary/build/types'
import BookList from '../booklist/BookList'

export default function WrapBookList({ deweySelect }: { deweySelect: DeweyCategory | null }) {
  const webSocketClient = useWebSocket()
  const deweyId = deweySelect?.dewey
  const [books, setBook] = useWSData<string>('BOOKLIST')

  useEffect(() => {
    if (deweyId) {
      setBook([])
      webSocketClient.emit('BOOKLIST', {
        id: deweyId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deweyId])

  return (
    <div>
      <BookList books={books} />
    </div>
  )
}
