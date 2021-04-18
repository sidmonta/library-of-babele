import { fetchAPI } from '../services'
import { useEffect } from 'react'
import { useWebSocket } from '../context/websocket'
import { atom, selectorFamily, useRecoilState } from 'recoil'

type NewBook = {
  uri: string
  dewey: string
  deweyLabel?: string
}

type WSNewBook = {
  bookUri: string
  dewey: string
}

const getDeweyLabel = fetchAPI('GET')

export const newbooks = atom<NewBook[]>({
  key: 'new-books',
  default: [],
})

export const haveNewBooks = selectorFamily({
  key: 'have-new-books',
  get: (dewey: string) => ({ get }) => {
    const newBooks = get(newbooks)
    return newBooks.filter((newbook) => newbook.dewey === dewey).length
  },
})

export const useNewBookHook = (onNewBook: (book: NewBook, allNewBooks: NewBook[], count: number) => void) => {
  const [newBooks, setNewBook] = useRecoilState<NewBook[]>(newbooks)
  const wsClient = useWebSocket()
  useEffect(() => {
    const identify = wsClient.on('NEWBOOK', async (book: WSNewBook) => {
      const deweyLabel: string = (await getDeweyLabel(`/get-dewey/${book.dewey}/label`)).label

      const rewriteBookInfo = {
        uri: book.bookUri,
        dewey: book.dewey,
        deweyLabel,
      }

      setNewBook((old: NewBook[]) => [rewriteBookInfo, ...old])
      // Call "onNewBook" for notify new book is arrive
      onNewBook(rewriteBookInfo, newBooks, newBooks.length)
    })

    return () => wsClient.removeListener('NEWBOOK', identify)
  }, [onNewBook, newBooks, setNewBook, wsClient])

  return newBooks
}
