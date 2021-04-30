import React, { useEffect } from 'react'
import {useWebSocket, useWSDataAsStream} from '../../../context/websocket'
import ServiceList from '../servicelist/ServiceList'
import {useLabel} from "../../../context/labeler";
import styled from "styled-components";
import MediaBook from "../mediabook/MediaBook";
import {useRecoilState} from "recoil";
import {langSelected} from "../../../store/books";
import {Quad} from "../../../services/models";
import SelectLang from "../selectlang/SelectLang";
import BookDataRowsContainer from "../bookdatarow/BookDataRowsContainer";
import {AiOutlineCloseCircle} from "react-icons/ai";

export interface WrapBookProps {
  book: string
  onClose?: (book: string) => void
}

const BookContainer = styled.div`
  height: 100%;

  display: grid;
  grid-template-columns: 0.8fr 1.2fr 1.4fr 0.6fr;
  grid-template-rows: 0.7fr 0.3fr 1.6fr;
  gap: 16px 8px;
  grid-template-areas:
    "book-media book-title book-title select-lang"
    "book-service book-service book-service book-service"
    "book-data book-data book-data book-data";

  .book-media {
    grid-area: book-media;
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
  }
  .book-title {
    grid-area: book-title;
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
  }
  .select-lang {
    grid-area: select-lang;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
  }
  .book-service {
    grid-area: book-service;
    display: flex;
    align-content: center;
    justify-content: flex-start;
    overflow-x: scroll;
  }
  .book-data {
    grid-area: book-data;
    overflow-y: auto;
  }
`

const CloseBtn = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  font-size: var(--default-main-btn-size);
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  cursor: pointer;
  outline: inherit;
`

export default function WrapBook({ book, onClose }: WrapBookProps) {
  const [lang] = useRecoilState(langSelected)
  const webSocketClient = useWebSocket()
  const data$ = useWSDataAsStream<{ quad: Quad }>('BOOKDATA_' + book)
  const bookTitle: string = useLabel(book, lang)[0] as string

  useEffect(() => {
    if (book) {
      webSocketClient.emit('BOOKDATA', {
        uri: book,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book])

  return (
    <BookContainer>
      <div className="book-media">
        <CloseBtn onClick={() => onClose && onClose(book)}><AiOutlineCloseCircle /></CloseBtn>
        <MediaBook data={data$} />
      </div>
      <div className="book-title">
        <h2>{bookTitle}</h2>
      </div>
      <div className="select-lang">
        <SelectLang data={data$}/>
      </div>
      <div className="book-service">
        <ServiceList book={book} />
      </div>
      <div className="book-data">
        <BookDataRowsContainer data={data$} />
      </div>
    </BookContainer>
  )
}
