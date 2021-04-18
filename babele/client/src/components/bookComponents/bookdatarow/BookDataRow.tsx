import React from 'react'
import { Quad } from '../wrapbook/WrapBook'
import { useLabel } from '../../../context/labeler'
import { useRedirect } from '../../../services'
import { validURL } from '@sidmonta/babelelibrary/build/tools'

const BookLink = ({ url, label }: { url: string; label: string }) => {
  const redirect = useRedirect()

  const clickHandle = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    await redirect(url)
  }

  return (
    <button onClick={clickHandle} title={url}>
      {label}
    </button>
  )
}

export default function BookDataRow({ data }: { data: Quad }) {
  const labelPredicate: string = useLabel(data.predicate.value)[0] as string
  const labelObject: string = useLabel(data.object.value)[0] as string
  console.log(data.object.value)
  const printObject = validURL(data.object.value) ? (
    <BookLink url={data.object.value} label={labelObject} />
  ) : (
    data.object.value
  )

  return (
    <p>
      <span>{labelPredicate}</span>: {printObject}
    </p>
  )
}
