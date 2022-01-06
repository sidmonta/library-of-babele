import styled from "styled-components";


export const FullRow = styled.div`
  position: relative;
  width: 100vw;
  left: 3rem;
  margin-left: -5rem;
  background-color: #fcfcfc80;
`

export const WrapContainer = styled.div`
  overflow-x: scroll;
  padding: 1.5rem 0;
  text-align: center;
  width: 100%;
  display: inline-flex;
  align-items: flex-end;
  flex-wrap: nowrap;
  gap: 12px;
`

export const InlineList = styled.ul`
  display: flex;
  gap: 1em;
`

export const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
`
