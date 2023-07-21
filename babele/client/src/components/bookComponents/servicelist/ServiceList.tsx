import React, { useEffect, useState } from 'react';
import { useWSData } from '../../../context/websocket';
import { useGrabFavicon } from '../../../context/favicon';
import styled from 'styled-components';
import { InlineList } from '../../common/structure';
import { AiOutlineLink } from 'react-icons/ai';

const FaviconImg = styled.img`
  width: 30px;
  height: 30px;
`;

const ServiceFavicon = ({ service }: { service: string }) => {
  const [fav, setFav] = useState<string>();
  const grab = useGrabFavicon();

  useEffect(() => {
    grab.grab(service).then(setFav);
  }, [service, grab]);

  return fav ? <FaviconImg src={fav} title={service} alt={service} /> : <span>loading...</span>;
};

export default function ServiceList({ book }: { book: string }) {
  const [data, setData] = useWSData<{ service: string }>('BOOKDATASERVICE_' + book);
  useEffect(() => {
    setData([]);
  }, [book, setData]);
  return (
    <div className="service-list">
      <InlineList>
        {data.map(({ service }, idx) => (
          <li key={service + '-' + idx}>
            <a href={service} title={service} target="_blank" rel="noreferrer">
              <ServiceFavicon service={service} />
            </a>
          </li>
        ))}
      </InlineList>
    </div>
  );
}
