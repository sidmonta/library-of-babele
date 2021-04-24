import styled, { css } from 'styled-components'
import { TitleProps } from './title'

const Title = styled.h1`
  font-family: 'Roboto Thin', sans-serif;
  display: block;
  font-size: ${(props: TitleProps) => props.size || 46}px;
  color: ${(props: TitleProps) => props.color || 'var(--main-text-color)'};
  ${(props: TitleProps) =>
    props.vertical &&
    css`
      writing-mode: vertical-lr;
      text-orientation: upright;
      letter-spacing: -15px;
    `}
  ${(props: TitleProps) =>
    props.nowrap &&
    css`
      white-space: nowrap;
      word-spacing: -15px;
    `}

  background-color: var(--color-red);
  background-image: linear-gradient(
    45deg,
    var(--color-red) 16.666%,
    #E16541 16.666%,
    #E16541 33.333%,
    #F18F43 33.333%,
    #F18F43 50%,
    #8B9862 50%,
    #8B9862 66.666%,
    #476098 66.666%,
    #476098 83.333%,
    #A7489B 83.333%);

  background-size: 160%;
  background-repeat: repeat;

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  animation: title-animations 30s ease infinite;
  animation-direction: alternate-reverse;

`

export default Title
