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
  grid-template-columns: 50px 1fr 4fr 50px;
  grid-template-rows: 50px 1fr 30px 5fr;
  gap: 16px 8px;

  .close-btn {
    grid-column: 1 / 1;
  }
  .select-lang {
    grid-column-start: -1;
    grid-row-start: 1;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
  }

  .book-media {
    grid-row-start: 2;
    grid-column-start: 2;
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
  }
  .book-title {
    grid-column-start: 3;
    grid-row-start: 2;
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
  }
  .book-service {
    grid-column: 1 / -1;
    grid-row: 3 / 4;
    display: flex;
    align-content: center;
    justify-content: flex-start;
    overflow-x: scroll;
  }
  .book-data {
    grid-row-start: 4;
    grid-column: 1 / -1;
    overflow-y: auto;
  }
`

const CloseBtn = styled.button`
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
      <div className="close-btn">
        <CloseBtn onClick={() => onClose && onClose(book)}><AiOutlineCloseCircle /></CloseBtn>
      </div>
      <div className="book-media">
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
