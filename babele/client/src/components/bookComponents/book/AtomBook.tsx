import React from 'react';
import { Tools } from '@sidmonta/babelelibrary';
import * as he from 'he';
import { useLabel } from '../../../context/labeler';
import { ThemeComponentFactory } from '../../../context/theme';
import { generateColorFromString } from '@sidmonta/babelelibrary/build/tools';

import { Container, Book, Front, FrontCover, LeftSide, LeftSideContent } from './AtomBookStyle';

const Fallback = ({ url }: { url: string }) => (
  <div style={{ width: '150px', height: '200px', backgroundColor: Tools.generateColorFromString(url) }}>
    {url}
  </div>
);

export default function AtomBook({ url }: { url: string }) {
  const label: string = useLabel(url)[0] as string;
  const BookCover = ThemeComponentFactory<{ color: string }>(
    'bookComponents/book/AtomBook',
    <Fallback url={url} />
  );

  const bookColor = generateColorFromString(url);

  return (
    <div color={bookColor}>
      <Container>
        <Book>
          <Front>
            <FrontCover color={bookColor}>{he.decode(label)}</FrontCover>
          </Front>
          <LeftSide color={bookColor}>
            <LeftSideContent>{he.decode(label)}</LeftSideContent>
          </LeftSide>
        </Book>
      </Container>
      {/* <BookCover color={bookColor}>{he.decode(label)}</BookCover> */}
    </div>
  );
}
