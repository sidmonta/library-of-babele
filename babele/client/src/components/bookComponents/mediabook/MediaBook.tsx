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
    if (!mime.extensions.hasOwnProperty(type)) { continue }
    if (type.startsWith(ext)) {
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
  position: absolute;
  & > img {
    position: relative;
    width: 100px;
    height: 150px;
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
  }, [])

  return (
      <ImgStack>
        {isEmpty(media) ? <PhotoswipeGallery media={media} /> : <EmptyImg />}
      </ImgStack>
  )
}
