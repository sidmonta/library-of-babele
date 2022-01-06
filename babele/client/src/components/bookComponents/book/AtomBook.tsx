import React from 'react';
import * as he from 'he';
import { useLabel } from '../../../context/labeler';
import {generateColorFromString, validURL} from '@sidmonta/babelelibrary/build/tools';

import { Container, Book, Front, FrontCover, LeftSide, LeftSideContent } from './AtomBookStyle';


export default function AtomBook({ url }: { url: string }) {
  const label: string = useLabel(url)[0] as string;
  const bookColor = generateColorFromString(url);

  const labelRender = () =>
    validURL(label) ? 'Loading...' : he.decode(label)


  return (
    <div color={bookColor}>
      <Container>
        <Book>
          <Front>
            <FrontCover color={bookColor}>{labelRender()}</FrontCover>
          </Front>
          <LeftSide color={bookColor}>
            <LeftSideContent>{labelRender()}</LeftSideContent>
          </LeftSide>
        </Book>
      </Container>
    </div>
  );
}
