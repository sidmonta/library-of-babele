import React, {createRef, useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'

import WoodBookcase from '../../components/bookcaseComponents/woodbookcase/WoodBookcase'
import BookList from '../../components/booksStackComponents/booklist/BookList'
import { useWebSocket, useWSData } from '../../context/websocket'
import {Route, Switch, useRouteMatch} from "react-router";
import BookView from "../BookView/BookView";
import {customDecodeUri} from "@sidmonta/babelelibrary/build/tools";
import BookLoader from "../../components/common/BookLoader";
import styled from "styled-components";

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
`

export default function SearchResult() {
  let { path } = useRouteMatch()
  const { query } = useParams<{ query: string }>()
  const webSocketClient = useWebSocket()
  const [books, setBook] = useWSData<string>('BOOKSEARCH')
  const [page, setPage] = useState<number>(0)
  const loaderDom = createRef<HTMLDivElement>()

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

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1
    };

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5 && books.length > 50 && books.length % 50 === 0) {
          setPage((prev) => prev + 1)
        }
      });
    }

    const observer = new IntersectionObserver(handleIntersect, options);
    if (loaderDom.current) {
      observer.observe(loaderDom.current);
    }

    return () => observer.disconnect()
  }, [loaderDom])

  useEffect(() => {
    const id = setTimeout(() => {
      webSocketClient.emit('BOOKSEARCH', { query: customDecodeUri(query), page: 1 })
    }, 10000)

    return () => clearTimeout(id)
  }, [])

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
