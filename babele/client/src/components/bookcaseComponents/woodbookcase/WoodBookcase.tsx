import React, { PropsWithChildren } from 'react'
import styled from 'styled-components'
import Title from '../../common/title/title'

export const WoodContainer = styled.div`
  width: 100%;
  padding-top: 25px;
  min-height: 70vh;

  .wood-header {
    display: flex;
    align-items: center;
    justify-content: center;
    position: sticky;
    top: 0;
    padding: 15px;
    z-index: 1;
    background-color: #fcfcfc;

    .center-text {
      font-size: 30px;
    }
  }

  .wood-main {
    margin: 0 70px;
    padding: 25px;
  }
`
type WoodBookcaseProps = {
  title: string
}
export default function WoodBookcase(props: PropsWithChildren<WoodBookcaseProps>) {
  const title = props.title

  return (
    <WoodContainer className="bg-overlay">
      <div className="wood-header">
        <Title className="center-text">{title}</Title>
      </div>
      <div className="wood-main">{props.children}</div>
    </WoodContainer>
  )
}
