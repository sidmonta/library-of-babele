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
  white-space: nowrap;
  padding: 1.5rem 0;
  text-align: center;
  width: 100%;
  display: inline-flex;
  align-items: flex-end;
  flex-wrap: nowrap;
  gap: 12px;
`

export const LoadMoreBtn = styled.div`
  display: inline-block;
  background-color: var(--color-green);
  color: #ffffff;
  padding: 5px 30px;
  border-radius: 6px;
  position: relative;
  cursor: pointer;

  .icon {
    font-size: 24px;
  }

  .badge {
    position: absolute;
    top: -10px;
    right: -10px;
    padding: 5px;
    box-shadow: 2px 2px 5px 0 #ababab;

    background-color: var(--color-red);
    border-radius: 50%;
    clip-path: polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%);
    display: inline-flex;
    justify-content: center;
    color: white;
    align-items: center;
  }
`

export const InlineList = styled.ul`
  display: flex;
  gap: 1em;
`
