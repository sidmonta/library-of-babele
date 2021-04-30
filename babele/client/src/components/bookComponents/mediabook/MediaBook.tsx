import {useEffect, useState} from "react";
import {Quad} from "../../../services/models";
import img from '../../../img/No-Image-Placeholder.svg'
import styled from "styled-components";
import {Observable} from "rxjs";
import {filter} from "rxjs/operators";

export interface MediaBookProps {
  data: Observable<{ quad: Quad}>
}

const mediaRegex = new RegExp(`(jpg|png|jpeg)`, 'i')

const EmptyImg = () => {
  return (
    <img src={img} alt="no media found" width={100} height={150} />
  )
}

const ImgStack = styled.div`
  position: absolute;
  & > img {
    position: relative;
    width: 100px;
    height: 150px;
  }
`

export default function MediaBook (props: MediaBookProps) {
  const { data } = props
  const [media, setMedia] = useState<Array<{ quad: Quad }>>([])

  useEffect(() => {
    const subscriber = data.pipe(
      filter(d => Boolean(d.quad.object.value.match(mediaRegex)))
    ).subscribe(value => {
      setMedia(old => [...old, value])
    })

    return () => subscriber.unsubscribe()
  }, [])

  return (
      <ImgStack>
        {media.length ? media.map(({ quad }, index) => {
          return <img key={quad.object.value} src={quad.object.value} alt={quad.subject.value} style={index > 0 ? { transform: `rotate(${Math.round(Math.random() * 100)}deg)`} : {}}/>
        }) : <EmptyImg />}
      </ImgStack>
  )
}
