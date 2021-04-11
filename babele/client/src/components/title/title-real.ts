import styled, { css } from 'styled-components'
import { TitleProps } from './title'

const Title = styled.h1`
  font-family: 'Chilanka', cursive;
  display: block;
  font-size: ${(props: TitleProps) => props.size || 64}px;
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
`

export default Title
