import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import WoodBookcase from '../../components/bookcaseComponents/woodbookcase/WoodBookcase'
import BookList from '../../components/booksStackComponents/booklist/BookList'
import { useWebSocket, useWSData } from '../../context/websocket'
import {Route, Switch, useRouteMatch} from "react-router";
import BookView from "../BookView/BookView";
import {customDecodeUri} from "@sidmonta/babelelibrary/build/tools";

export default function SearchResult() {
  let { path } = useRouteMatch()
  const { query } = useParams<{ query: string }>()
  const webSocketClient = useWebSocket()
  const [books, setBook] = useWSData<string>('BOOKSEARCH')

  useEffect(() => {
    if (query) {
      setBook([])
      webSocketClient.emit('BOOKSEARCH', { query: customDecodeUri(query) })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return (
    <div className="page-container">
      <WoodBookcase title={customDecodeUri(query) || ''}>
        <div className="wood-book">
          <BookList books={books} />
        </div>
      </WoodBookcase>
      <Switch>
        <Route exact path={path} />
        <Route path={`${path}/book/:bookUri`}>
          <BookView />
        </Route>
      </Switch>
    </div>
  )
}
