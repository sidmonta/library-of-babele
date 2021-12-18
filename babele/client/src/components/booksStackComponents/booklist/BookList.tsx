import React from 'react'
import AtomBook from '../../bookComponents/book/AtomBook'

const BookList = ({ books }: { books: string[] }) => {

  return (
    <div>
      <ul className="masonry">
        {books.map((b: string, index: number) => (
          <li key={index}>
            <AtomBook url={b} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BookList
