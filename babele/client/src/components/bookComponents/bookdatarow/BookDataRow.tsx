import React from 'react';
import { useLabel } from '../../../context/labeler';
import { useRedirect } from '../../../services';
import { validURL } from '@sidmonta/babelelibrary/build/tools';
import * as he from 'he';
import { Quad } from '../../../services/models';
import { useRecoilState } from 'recoil';
import { langSelected } from '../../../store/books';
import styled from 'styled-components';

const Row = styled.p`
  line-height: 1.618;
  margin: 0;
  text-align: justify;
  font-family: georgia, 'times new roman', serif;
  display: flex;

  span.row-item {
    text-transform: capitalize;
    margin-right: 1rem;
    font-size: smaller;
  }
`;

const LinkContainer = styled.span`
  display: flex;
  .link-identify {
    display: flex;
    position: relative;
    .point {
      width: 2px;
      height: 2px;
      border-radius: 50%;
      background-color: #333;
      position: absolute;
      top: 50%;
      left: -5px;
    }
  }

  .link {
    position: relative;
    display: inline-block;
    border-bottom: solid 1px #324577;
    cursor: pointer;
    overflow: hidden;
    transition: border-bottom-width 0.2s ease-in-out;

    &:hover {
      border-bottom-width: 2px;
    }
  }
`;

const BookLink = ({ url, label }: { url: string; label: string }) => {
  const redirect = useRedirect();

  const clickHandle = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await redirect(url);
  };

  return (
    <LinkContainer onClick={clickHandle} title={url}>
      <span className="link-identify">
        <span className="point" />
      </span>
      <span className="link">{he.decode(label)}</span>
    </LinkContainer>
  );
};

export default function BookDataRow({ data }: { data: Quad }) {
  const [lang] = useRecoilState(langSelected);
  const labelPredicate: string = useLabel(data.predicate.value, lang)[0] as string;
  const labelObject: string = useLabel(data.object.value, lang)[0] as string;
  const printObject = validURL(data.object.value) ? (
    <BookLink url={data.object.value} label={labelObject} />
  ) : (
    he.decode(data.object.value)
  );

  return (
    <Row>
      <span className="row-item">{labelPredicate}:</span> {printObject}
    </Row>
  );
}
