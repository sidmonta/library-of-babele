import React from 'react'
import {useHistory, useParams} from 'react-router-dom'
import WrapBook from "../../components/bookComponents/wrapbook/WrapBook";

export default function BookView() {
  const params: { bookUri: string, categoryId: string } = useParams()
  const bookUri = decodeURIComponent(params.bookUri || '')
  const history = useHistory()

  const closeBook = () => {
    history.replace({ pathname: '/category/' + params.categoryId })
  }

  return (
    <div className="book-view">
      <WrapBook key={bookUri} book={bookUri} onClose={closeBook} />
    </div>
  )
}
