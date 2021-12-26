import {Observable} from "rxjs";
import {Quad} from "../../../services/models";
import React, {useEffect, useState} from "react";
import BookDataRow from "./BookDataRow";
import {filter} from "rxjs/operators";
import {useRecoilState} from "recoil";
import {langSelected} from "../../../store/books";

export default function BookDataRowsContainer(props: { data: Observable<{ quad: Quad }>}) {
  const stream = props.data
  const [bookRow, setBookRow] = useState<Quad[]>([])
  const [lang] = useRecoilState(langSelected)
  const [pagination, setPagination] = useState({
    page: 0,
    numElem: 40
  })

  const nextPage = () => {
    setPagination({
      ...pagination,
      page: pagination.page + 1
    })
  }

  const prevPage = () => {
    setPagination({
      ...pagination,
      page: pagination.page - 1
    })
  }

  const startPage = () => pagination.page * pagination.numElem
  const endPage = () => (pagination.page * pagination.numElem) + pagination.numElem

  useEffect(() => {
    const subscriber = stream.pipe(
      filter(({ quad }) => !quad.object.language || quad.object.language === lang),
    ).subscribe(({quad}) => {
      setBookRow(old => [...old, quad])
    })

    return () => subscriber.unsubscribe()
  }, [lang, stream])

  return (
    <div>
      <button onClick={nextPage}>Next Page</button>
      {pagination.page > 0 && <button onClick={prevPage}>Prev Page</button> }
      <ul className="bookdata-list-wrapper">
        {bookRow.slice(startPage(), endPage()).map((d, index) => <li key={index}><BookDataRow data={d} /></li>)}
      </ul>
    </div>
  )
}
