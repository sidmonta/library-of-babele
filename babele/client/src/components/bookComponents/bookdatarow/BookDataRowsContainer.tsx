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

  const nextPage = (page: number) => {
    setPagination({
      ...pagination,
      page
    })
  }

  const startPage = () => pagination.page * pagination.numElem
  const endPage = () => (pagination.page * pagination.numElem) + pagination.numElem - 1

  useEffect(() => {
    stream.pipe(
      filter(({ quad }) => !quad.object.language || quad.object.language === lang),
    ).subscribe(({quad}) => {
      setBookRow(old => [...old, quad])
    })
  }, [lang, stream])

  const pages = () => {
    return <div>
      {Array.from(Array(Math.trunc(bookRow.length / pagination.numElem) + 1).keys())
        .map((ind) => <input onChange={() => nextPage(ind)} type="radio" key={ind} checked={ind === pagination.page} name="pages" />)}
    </div>
  }

  return (
    <div>
      {pages()}
      <ul className="bookdata-list-wrapper">
        {bookRow.slice(startPage(), endPage()).map((d, index) => <li key={index}><BookDataRow data={d} /></li>)}
      </ul>
    </div>
  )
}
