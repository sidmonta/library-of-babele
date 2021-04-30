import React, {useEffect, useState} from 'react'
import { useWSData } from '../../../context/websocket'
import {useGrabFavicon} from "../../../context/favicon";
import styled from "styled-components";
import {InlineList} from "../../structure/structure";

const FaviconImg = styled.img`
  width: 30px;
  height: 30px;
`

const ServiceFavicon = ({ service }: { service: string }) => {
  const [fav, setFav] = useState<string>()
  const grab = useGrabFavicon()

  useEffect(() => {
    const get = async () => {
      const favIcon = await grab.grab(service)
      setFav(favIcon)
    }
    get().then().catch()
  }, [ service, grab])

  return (fav ? <FaviconImg src={fav} title={service}  alt={service}/> : <span>loading...</span>)
}

export default function ServiceList({ book }: { book: string }) {
  const [data, setData] = useWSData<{ service: string }>('BOOKDATASERVICE_' + book)
  useEffect(() => {
    setData([])
  }, [book, setData])
  return (
    <div className='service-list'>
      <InlineList>
        {data.map(({service}) => (
          <li key={service}>
            <a href={service} title={service} target='_blank' rel="noreferrer">
              <ServiceFavicon service={service} />
            </a>
          </li>
        ))}
      </InlineList>
    </div>
  )
}
