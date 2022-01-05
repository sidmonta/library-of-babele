import React, {MouseEvent} from 'react'
import AtomBook from '../../bookComponents/book/AtomBook'
import {useRedirect} from "../../../services";

const BookList = ({ books }: { books: string[] }) => {
  const routeTo = useRedirect()

  const handleClick = (event: MouseEvent<HTMLUListElement>) => {
    const target = event.target as HTMLDivElement
    const li: HTMLLIElement | null = target.closest('li')
    if (li) {
      routeTo(li.dataset.url || '')
    }
  }

  return (
    <div>
      <ul className="masonry" onClick={handleClick}>
        {books.map((b: string, index: number) => (
          <li key={index} data-url={b}>
            <AtomBook url={b}/>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BookList
