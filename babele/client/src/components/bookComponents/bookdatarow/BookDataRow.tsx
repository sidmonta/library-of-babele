import React from 'react'
import { useLabel } from '../../../context/labeler'
import { useRedirect } from '../../../services'
import { validURL } from '@sidmonta/babelelibrary/build/tools'
import * as he from "he";
import {Quad} from "../../../services/models";
import {useRecoilState} from "recoil";
import {langSelected} from "../../../store/books";

const BookLink = ({ url, label }: { url: string; label: string }) => {
  const redirect = useRedirect()

  const clickHandle = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    await redirect(url)
  }

  return (
    <button onClick={clickHandle} title={url}>
      {he.decode(label)}
    </button>
  )
}

export default function BookDataRow({ data }: { data: Quad }) {
  const [lang] = useRecoilState(langSelected)
  const labelPredicate: string = useLabel(data.predicate.value, lang)[0] as string
  const labelObject: string = useLabel(data.object.value, lang)[0] as string
  const printObject = validURL(data.object.value) ? (
    <BookLink url={data.object.value} label={labelObject} />
  ) : (
    he.decode(data.object.value)
  )

  return (
    <p>
      <span>{labelPredicate}</span>: {printObject}
    </p>
  )
}
