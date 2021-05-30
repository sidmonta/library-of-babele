import {useEffect, useState} from "react";
import {Quad} from "../../../services/models";
import img from '../../../img/No-Image-Placeholder.svg'
import styled from "styled-components";
import {Observable, Subscription} from "rxjs";
import {filter} from "rxjs/operators";
import PhotoswipeGallery from "./PhotoswipeGallery";
const mime = require('mime-types')


function getExtensions(ext: string): string[] {
  const aggregator: string[] = []
  for (const type in mime.extensions as Record<string, string[]>) {
    if (mime.extensions.hasOwnProperty(type) && type.startsWith(ext)) {
      aggregator.push(...mime.extensions[type])
    }
  }
  return aggregator
}

const generateRegexFromArray = (...elements: string[]) =>
  new RegExp(`(${elements.join('|')})$`, 'i')

export interface MediaBookProps {
  data: Observable<{ quad: Quad}>
}

const extensionImage = getExtensions('image')
const extensionVideo = getExtensions('video')
const extensionAudio = getExtensions('audio')
const extensionDocuments = getExtensions('application')

const regexList = {
  images: generateRegexFromArray(...extensionImage),
  videos: generateRegexFromArray(...extensionVideo),
  audios: generateRegexFromArray(...extensionAudio),
  docs: generateRegexFromArray(...extensionDocuments)
}

const EmptyImg = () => {
  return (
    <img src={img} alt="no media found" width={100} height={150} />
  )
}

const ImgStack = styled.div`
  position: relative;
  cursor: pointer;
  & > img {
    position: absolute;
    width: 100px;
    height: 150px;
    top: 0;
    left: 0;
    transform: inherit;
    transition: .5s ease-in-out;
    border-radius: 5px;

    &:nth-last-child(2) {
      transform: rotate(0deg) translateY(0);
      box-shadow: 1px 1px 5px #b3b3b3;
    }
    &:nth-last-child(3) {
      transform: rotate(-15deg) translateX(-35px);
      box-shadow: 1px 1px 5px #b3b3b3;
    }
    &:nth-last-child(4) {
      transform: rotate(15deg) translateX(35px);
      box-shadow: 1px 1px 5px #b3b3b3;
    }
    & > img:nth-last-child(5) {
      transform: translateY(0px);
      box-shadow: 1px 1px 5px #b3b3b3;
    }
  }

  &:hover > img:nth-last-child(2) {
    transform: translateY(-35px);
  }
  &:hover > img:nth-last-child(3) {
    transform: translateX(-45px) rotate(-15deg);
  }
  &:hover > img:nth-last-child(4) {
    transform: translateX(45px) rotate(15deg);
  }
  &:hover > img:nth-last-child(5) {
    transform: translateY(15px);
  }
`

export type MediaObject = {
  images: Array<{ quad: Quad }>,
  videos: Array<{ quad: Quad }>,
  audios: Array<{ quad: Quad }>,
  docs: Array<{ quad: Quad }>,
}

export default function MediaBook (props: MediaBookProps) {
  const { data } = props
  const [media, setMedia] = useState<MediaObject>({ images: [], videos: [], audios: [], docs: [] })

  const isEmpty = (media: MediaObject) => !(media.images.length || media.audios.length || media.videos.length || media.docs.length)

  useEffect(() => {
    const subscribers: Subscription[] = (['images', 'videos', 'audios', 'docs'] as const).map(type => {
      return data.pipe(
        filter(d => Boolean(d.quad.object.value.match(regexList[type])))
      ).subscribe(value => {
        setMedia(old => ({
          ...old,
          [type]: [...old[type], value]
        }))
      })
    })
    return () => subscribers.forEach(s => s.unsubscribe)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
      <ImgStack>
        {!isEmpty(media) ? <PhotoswipeGallery media={media} /> : <EmptyImg />}
      </ImgStack>
  )
}
