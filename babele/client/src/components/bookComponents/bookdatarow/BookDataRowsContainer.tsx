import { Observable } from 'rxjs';
import { Quad } from '../../../services/models';
import React, { useEffect, useState } from 'react';
import BookDataRow from './BookDataRow';
import { filter } from 'rxjs/operators';
import { useRecoilState } from 'recoil';
import { langSelected } from '../../../store/books';
import styled from 'styled-components';
import List from 'react-virtualized/dist/commonjs/List';

const PaginationList = styled.div`
  position: sticky;
  top: -1px;
  margin: 0 auto 2em auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-bottom: 0.4px solid;
  width: 100%;
  height: 25px;
  background-color: antiquewhite;
  z-index: 1;

  & > span {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  input {
    position: relative;
    appearance: none;
    display: block;
    margin: 10px;
    width: 18px;
    height: 18px;
    border-radius: 12px;
    cursor: pointer;
    vertical-align: middle;
    box-shadow: hsla(0, 0%, 100%, 0.15) 0 1px 1px, inset hsla(0, 0%, 0%, 0.5) 0 0 0 1px;
    background-color: hsla(0, 0%, 0%, 0.2);
    background-image: radial-gradient(
      circle,
      rgba(63, 94, 251, 1) 0%,
      rgba(48, 179, 235, 1) 31%,
      rgba(38, 196, 224, 0.5200674019607843) 67%,
      rgba(29, 170, 213, 0.7161458333333333) 100%
    );
    background-repeat: no-repeat;
    transition: background-position 0.15s cubic-bezier(0.8, 0, 1, 1),
      transform 0.25s cubic-bezier(0.8, 0, 1, 1);
    outline: none;
    background-position: 0 24px;

    &:after {
      position: absolute;
      content: '';
      width: 15rem;
      left: 0;
      right: 0;
      height: 40px;
      top: -10px;
    }

    &:checked {
      transition: background-position 0.2s 0.15s cubic-bezier(0, 0, 0.2, 1),
        transform 0.25s cubic-bezier(0, 0, 0.2, 1);
      background-position: 0 0;
    }
    &:active {
      transform: scale(1.5);
      transition: transform 0.1s cubic-bezier(0, 0, 0.2, 1);
      background-position: 0 24px;
    }

    &:checked ~ input,
    &:checked ~ input:active {
      background-position: 0 -24px;
    }
  }
`;

export default function BookDataRowsContainer(props: { data: Observable<{ quad: Quad }> }) {
  const stream = props.data;
  const [bookRow, setBookRow] = useState<Quad[]>([]);
  const [lang] = useRecoilState(langSelected);
  const [pagination, setPagination] = useState({
    page: 0,
    numElem: 40
  });

  const nextPage = (page: number) => {
    setPagination({
      ...pagination,
      page
    });
  };

  const startPage = () => pagination.page * pagination.numElem;
  const endPage = () => pagination.page * pagination.numElem + pagination.numElem - 1;

  useEffect(() => {
    stream
      .pipe(filter(({ quad }) => !quad.object.language || quad.object.language === lang))
      .subscribe(({ quad }) => {
        setBookRow((old) => [...old, quad]);
      });
  }, [lang, stream]);

  return (
    <div>
      <List
        height={360}
        rowHeight={({ index }) => {
          const row = bookRow[index];
          if (row.object.termType === 'Literal' && row.object.value.length > 95) {
            return 30 * (Math.floor(row.object.value.length / 95) + 1);
          }

          return 30;
        }}
        rowCount={bookRow.length}
        width={730}
        rowRenderer={({ index, key, style }) => (
          <div key={key} style={style}>
            <BookDataRow data={bookRow[index]} />
          </div>
        )}
      />
    </div>
  );
}
