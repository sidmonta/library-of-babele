import React from 'react'
import { useWSData } from '../../context/websocket'
import { Quad } from '../wrapbook/WrapBook'

export default function ServiceList({ book }: { book: string }) {
  const [data] = useWSData<{ quad: Quad }>('BOOKDATASERVICE_' + book)

  return (
    <ul>
      {data.map((service) => (
        <li>{service}</li>
      ))}
    </ul>
  )
}
