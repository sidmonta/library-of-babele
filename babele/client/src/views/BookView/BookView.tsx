import React, {useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import WrapBook from "../../components/bookComponents/wrapbook/WrapBook";
import {customEncodeUri} from "@sidmonta/babelelibrary/build/tools";

export default function BookView() {
  const params: { bookUri: string, categoryId: string, query: string } = useParams()
  const bookUri = decodeURIComponent(params.bookUri || '')
  const history = useHistory()

  // Block scroll of body when book is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  const closeBook = () => {
    const { query, categoryId } = params
    const isSearchPage = Boolean(query)
    const pathname = `/${isSearchPage ? 'search' : 'category'}/${isSearchPage ? customEncodeUri(query) : categoryId}`
    history.replace({ pathname })
  }

  return (
    <div className="book-view">
      <WrapBook key={bookUri} book={bookUri} onClose={closeBook} />
    </div>
  )
}
