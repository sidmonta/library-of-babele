import React from 'react'
import { useParams } from 'react-router-dom'
import BookStack from '../../components/bookstack/BookStack'

export default function BookView() {
  const params: { bookUri: string } = useParams()
  const bookUri = decodeURIComponent(params.bookUri || '')
  return (
    <div className="book-view">
      <h3>BookView: {bookUri}</h3>
      <BookStack first={bookUri} />
    </div>
  )
}
