import React, { useEffect } from 'react';
import { useWebSocket, useWSDataAsStream } from '../../../context/websocket';
import ServiceList from '../servicelist/ServiceList';
import { useLabel } from '../../../context/labeler';
import styled from 'styled-components';
import MediaBook from '../mediabook/MediaBook';
import { useRecoilState } from 'recoil';
import { langSelected } from '../../../store/books';
import { Quad } from '../../../services/models';
import BookDataRowsContainer from '../bookdatarow/BookDataRowsContainer';
import { AiOutlineCloseCircle } from 'react-icons/ai';

export interface WrapBookProps {
  book: string;
  onClose?: (book: string) => void;
}

const BookContainer = styled.div`
  height: 100%;

  border-radius: 5px;
  background: -webkit-gradient(linear, 0 0, 0 100%, from(#ccc), color-stop(4%, #efeae2)) 0 10px;
  background-size: 100% 30px;
  line-height: 3rem;

  display: grid;
  grid-template-columns: 4fr 1fr 50px;
  grid-template-rows: 50px 1fr 1fr 5fr;
  gap: 16px 8px;

  .close-btn {
    grid-column-start: -1;
    grid-row-start: 1;
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
    grid-column-start: 1;
    grid-row-start: 2;
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;

    border: 1px solid #333;
    border-left: 0;
    margin-bottom: calc(2rem * 1.618);
    padding: 0.5rem 0.5rem 1rem 0;
    position: relative;
    h2 {
      padding-left: 5rem;
    }
  }
  .book-service {
    grid-column: 1 / -1;
    grid-row: 3 / 4;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: flex-start;
    padding: 0 1rem 0 16px;

    .list {
      overflow-x: auto;
      overflow-y: hidden;
    }
  }
  .book-data {
    grid-row-start: 4;
    grid-column: 1 / -1;
    overflow-y: auto;
    padding: 1rem 2rem 1rem 5rem;
  }
`;

const CloseBtn = styled.button`
  font-size: calc(var(--default-main-btn-size) - 16px);
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  cursor: pointer;
  outline: inherit;
`;

export default function WrapBook({ book, onClose }: WrapBookProps) {
  const [lang] = useRecoilState(langSelected);
  const webSocketClient = useWebSocket();
  const data$ = useWSDataAsStream<{ quad: Quad }>('BOOKDATA_' + book);
  const bookTitle: string = useLabel(book, lang)[0] as string;

  useEffect(() => {
    if (book) {
      webSocketClient.emit('BOOKDATA', {
        uri: book
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book]);

  return (
    <BookContainer>
      <div className="close-btn">
        <CloseBtn onClick={() => onClose && onClose(book)}>
          <AiOutlineCloseCircle />
        </CloseBtn>
      </div>
      <div className="book-title">
        <h2>{bookTitle}</h2>
      </div>
      <div className="book-media">
        <MediaBook data={data$} />
      </div>
      <div className="book-service">
        <h4>Sorgenti:</h4>
        <div className="list">
          <ServiceList book={book} />
        </div>
      </div>
      <div className="book-data">
        <BookDataRowsContainer data={data$} />
      </div>
    </BookContainer>
  );
}
