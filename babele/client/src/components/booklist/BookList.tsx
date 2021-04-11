import React, { useEffect, useRef, useState } from 'react'
import AtomBook from '../book/AtomBook'

const getBookForPage = (books: string[], page: number) => {
  const numberToShow = 50
  return books.slice((page - 1) * numberToShow, page * numberToShow)
}

const BookList = ({ books }: { books: string[] }) => {
  const [bookForPage, setBookForPage] = useState({
    list: getBookForPage(books, 1),
  })
  const [page, setPage] = useState(1)
  const loader = useRef<HTMLDivElement | null>(null)

  const handleObserver = () => {
    setPage((page) => page + 1)
  }

  useEffect(() => {
    if (books.length && bookForPage.list.length < 50) {
      setBookForPage({
        list: getBookForPage(books, 1),
      })
    }
  }, [books])

  useEffect(() => {
    const otherBook = getBookForPage(books, page)
    console.log('load more')
    setBookForPage({
      list: bookForPage.list.concat(otherBook),
    })
  }, [page])

  return (
    <div>
      <ul className="masonry">
        {bookForPage.list.map((b: string, index: number) => (
          <li key={index}>
            <AtomBook url={b} />
          </li>
        ))}
      </ul>
      <div className="loading" ref={loader} onClick={handleObserver}>
        Load More
      </div>
    </div>
  )
}

export default BookList
