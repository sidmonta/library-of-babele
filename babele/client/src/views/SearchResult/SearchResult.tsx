import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import WoodBookcase from '../../components/bookcaseComponents/woodbookcase/WoodBookcase'
import BookList from '../../components/booksStackComponents/booklist/BookList'
import { useWebSocket, useWSData } from '../../context/websocket'
import {Route, Switch, useRouteMatch} from "react-router";
import BookView from "../BookView/BookView";
import {customDecodeUri} from "@sidmonta/babelelibrary/build/tools";
import BookLoader from "../../components/common/BookLoader";
import {useInterceptionPagination} from "../../services";
import {LoaderContainer} from "../../components/common/structure";

export default function SearchResult() {
  let { path } = useRouteMatch()
  const { query } = useParams<{ query: string }>()
  const webSocketClient = useWebSocket()
  const [books, setBook] = useWSData<string>('BOOKSEARCH')
  const [loaderDom, page] = useInterceptionPagination({ data: books, numElem: 50})

  useEffect(() => {
    if (query) {
      setBook([])
      webSocketClient.emit('BOOKSEARCH', { query: customDecodeUri(query), page: 0 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    if (query && page > 0) {
      webSocketClient.emit('BOOKSEARCH', { query: customDecodeUri(query), page })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  return (
    <div className="page-container">
      <WoodBookcase title={customDecodeUri(query) || ''}>
        <div className="wood-book">
          <BookList books={books} />
        </div>
        <LoaderContainer ref={loaderDom}>
          <BookLoader color={'#55786a'} size={0.3} />
        </LoaderContainer>
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
