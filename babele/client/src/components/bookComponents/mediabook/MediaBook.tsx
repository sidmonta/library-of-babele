import { useEffect, useState } from 'react';
import { Quad } from '../../../services/models';
import img from '../../../img/No-Image-Placeholder.svg';
import styled from 'styled-components';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import PhotoswipeGallery from './PhotoswipeGallery';
const mime = require('mime-types');

function getExtensions(ext: string): string[] {
  const aggregator: string[] = [];
  for (const type in mime.extensions as Record<string, string[]>) {
    if (type.startsWith(ext)) {
      aggregator.push(...mime.extensions[type]);
    }
  }
  return aggregator;
}

const generateRegexFromArray = (...elements: string[]) => new RegExp(`\\.(${elements.join('|')})$`, 'i');

export interface MediaBookProps {
  data: Observable<{ quad: Quad }>;
}

const extensionImage = getExtensions('image');
const extensionVideo = getExtensions('video');
const extensionAudio = getExtensions('audio');
const extensionDocuments = getExtensions('application');

const regexList = {
  images: generateRegexFromArray(...extensionImage),
  videos: generateRegexFromArray(...extensionVideo),
  audios: generateRegexFromArray(...extensionAudio),
  docs: generateRegexFromArray(...extensionDocuments)
};

const EmptyImg = () => {
  return <img src={img} alt="no media found" width={100} height={150} />;
};

const ImgStack = styled.div`
  cursor: pointer;
  position: relative;
  width: 100%;
  height: 100%;
  & > img {
    width: 100px;
    height: auto;
    border-radius: 5px;
    position: absolute;
  }
`;

export type MediaObject = {
  images: Array<{ quad: Quad }>;
  videos: Array<{ quad: Quad }>;
  audios: Array<{ quad: Quad }>;
  docs: Array<{ quad: Quad }>;
};

export default function MediaBook(props: MediaBookProps) {
  const { data } = props;
  const [media, setMedia] = useState<MediaObject>({ images: [], videos: [], audios: [], docs: [] });

  const isEmpty = (media: MediaObject) =>
    !(media.images.length || media.audios.length || media.videos.length || media.docs.length);

  useEffect(() => {
    const subscribers: Subscription[] = (['images', 'videos', 'audios', 'docs'] as const).map((type) => {
      return data
        .pipe(filter((d) => Boolean(d.quad.object.value.match(regexList[type]))))
        .subscribe((value) => {
          setMedia((old) => ({
            ...old,
            [type]: [...old[type], value]
          }));
        });
    });
    return () => subscribers.forEach((s) => s.unsubscribe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ImgStack>{!isEmpty(media) ? <PhotoswipeGallery media={media} /> : <EmptyImg />}</ImgStack>;
}
