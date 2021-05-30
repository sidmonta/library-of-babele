import type PhotoSwipe from "photoswipe"

import { Gallery, Item } from 'react-photoswipe-gallery'
import {MediaObject} from "./MediaBook";
import {Quad} from "../../../services/models";

import AudioPlaceholder from '../../../img/audio-placeholder.png'
import VideoPlaceholder from '../../../img/video-placeholder.jpeg'
import DocPlaceholder from '../../../img/doc-placeholder.jpeg'

import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'

const mime = require('mime-types')

interface ItemProps {
  src: string,
  origin: string,
  title: string,
  width?: number,
  height?: number
}

const htmlForVideo = (src: string) => `
<div style="width: 100%; height: 100%; display: flex; align-content: center; justify-content: center; align-items: center;">
    <video style="max-width: 80vw" controls>
        <source src="${src}" type="${mime.lookup(src)}">
        Your browser does not support the video tag.
    </video>
</div>
`

const htmlForAudio = (src: string) => `
<div style="width: 100%; height: 100%; display: flex; align-content: center; justify-content: center; align-items: center;">
    <audio controls>
        <source src="${src}" type="${mime.lookup(src)}">
        Your browser does not support the audio tag.
    </audio>
</div>
`

const htmlForDoc = (src: string, title: string) => `
<div style="width: 100%; height: 100%; display: flex; align-content: center; justify-content: center; align-items: center;">
    Apri il documento ${title} in un'altra tab premendo <a href="${src}">qui</a>
</div>
`


const ImageItem = (props: ItemProps) => {
  return (<Item
    original={props.src}
    width={props.width || "0"}
    height={props.height || "0"}
  >
    {({ref, open }) => (
      // @ts-ignore
      <img ref={ref} onClick={open} src={props.src} alt={props.title} />
    )}
  </Item>)
}

const VideoItem = (props: ItemProps) => {
  return (
    <Item html={htmlForVideo(props.src)}>
      {({ref, open }) => (
        // @ts-ignore
        <img ref={ref} onClick={open} src={VideoPlaceholder} alt={props.title} />
      )}
    </Item>
  )
}

const AudioItem = (props: ItemProps) => {
  return (
    <Item html={htmlForAudio(props.src)}>
      {({ref, open }) => (
        // @ts-ignore
        <img ref={ref} onClick={open} src={AudioPlaceholder} alt={props.title} />
      )}
    </Item>
  )
}

const DocItem = (props: ItemProps) => {
  return (
    <Item html={htmlForDoc(props.src, props.title)}>
      {({ref, open }) => (
        // @ts-ignore
        <img ref={ref} onClick={open} src={DocPlaceholder} alt={props.title} />
      )}
    </Item>
  )
}


const factoryItem = (media: Quad, type: string, index: number) => {
  switch (type) {
    case 'image':
      return <ImageItem key={'img-' + index} src={media.object.value} origin={media.subject.value} title={media.predicate.value} />
    case 'video':
      return <VideoItem key={'vid-' + index} src={media.object.value} origin={media.subject.value} title={media.predicate.value} />
    case 'audio':
      return <AudioItem key={'aud-' + index} src={media.object.value} origin={media.subject.value} title={media.predicate.value} />
    case 'doc':
      return <DocItem key={'doc-' + index} src={media.object.value} origin={media.subject.value} title={media.predicate.value} />
  }
}

export default function PhotoswipeGallery({ media }: {media: MediaObject}) {
  const options: PhotoSwipe.Options = {}

  const onOpen = (gallery: PhotoSwipe<typeof options>) => {
    const updateSize = (item: PhotoSwipe.Item) => {
      const itemW = typeof item.w === 'undefined' ?  100 : item.w
      const itemH = typeof item.h === 'undefined' ?  100 : item.h
      const itemSrc = item.src || ''
      if (itemW < 1 || itemH < 1) { // unknown size
        const img = new Image()
        img.onload = function() { // will get size after load
          item.w = img.width
          item.h = img.height
          gallery.invalidateCurrItems()
          gallery.updateSize(true)
        }
        img.src = itemSrc
      }
    }

    gallery.listen('imageLoadComplete', function(index, item) {
      updateSize(item)
    });
    gallery.listen('gettingData', function(index: number, item: PhotoSwipe.Item) {
      updateSize(item)
    });
  }

  return (
    <Gallery options={options} onOpen={onOpen}>
      {media.images.map((m, index) => factoryItem(m.quad, 'image', index))}
      {media.videos.map((m, index) => factoryItem(m.quad, 'video', index))}
      {media.audios.map((m, index) => factoryItem(m.quad, 'audio', index))}
      {media.docs.map((m, index) => factoryItem(m.quad, 'doc', index))}
    </Gallery>
  )
}
