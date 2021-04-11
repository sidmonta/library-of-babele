import React, { KeyboardEvent, ChangeEvent, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { useHistory } from 'react-router-dom'

type SearchBarProps = { closed: boolean; onClick?: () => void }

const closeOne = keyframes`
  0% {
    height: 25px;
    transform: translate(-25px, 12.5px) rotate(45deg);
  }
  10% {
    height: 25px;
    transform: translate(-25px, 12.5px) rotate(45deg);
  }
  60% {
    height: 0px;
    transform: translate(-8px, 8px) rotate(45deg);
  }
  100% {
    height: 0px;
    transform: translate(-8px, 8px) rotate(45deg);
  }
`

const closeTwo = keyframes`
  0% {
    height: 25px;
    transform: translate(-25px, 12.5px) rotate(-45deg);
  }
  60% {
    height: 2px;
    transform: translate(-6px, 37.5px) rotate(-45deg);
  }
  70% {
    height: 2px;
    transform: translate(-6px, 37.5px) rotate(-45deg);
  }
  100% {
    height: 25px;
    transform: translate(0, 37.5px) rotate(-45deg);
  }
`

const closeOneReverse = keyframes`
  0% {
    height: 0px;
    transform: translate(-8px, 8px) rotate(45deg);
  }
  40% {
    height: 0px;
    transform: translate(-8px, 8px) rotate(45deg);
  }
  80% {
    height: 25px;
    transform: translate(-25px, 12.5px) rotate(45deg);
  }
  100% {
    height: 25px;
    transform: translate(-25px, 12.5px) rotate(45deg);
  }
`

const closeTwoReverse = keyframes`
  0% {
    height: 25px;
    transform: translate(0, 37.5px) rotate(-45deg);
  }
  40% {
    height: 2px;
    transform: translate(-6px, 40.5px) rotate(-45deg);
  }
  50% {
    height: 2px;
    transform: translate(-6px, 40.5px) rotate(-45deg);
  }
  100% {
    height: 25px;
    transform: translate(-25px, 12.5px) rotate(-45deg);
  }
`

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
  height: 50px;
  margin: 0 auto;

  transition: all 0.5s cubic-bezier(0.7, 0.03, 0.17, 0.97) 0.25s;

  ${(props: SearchBarProps) =>
    props.closed &&
    css`
      width: 50px;
    `}

  input {
    outline: none;
    box-shadow: none;
    height: 50px;
    line-height: 50px;
    width: 100%;
    padding: 0 1em;
    box-sizing: border-box;
    background: transparent;
    color: var(--main-text-color);
    border: 4px solid var(--main-text-color);
    border-radius: 50px;
    font-size: 18px;

    ${(props: SearchBarProps) =>
      props.closed &&
      css`
        color: #e62878;
      `}
  }
`

const Toggle = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  cursor: pointer;
  right: 0;
  top: 0;
  border-radius: 50px;

  transition: all 0.5s cubic-bezier(0.98, 0.02, 0.46, 0.99) 0.25s;

  &:after,
  &:before {
    transition: all 1s;
    border-color: #ee6da3;
    content: '';
    display: block;
    position: absolute;
    right: 0;
    width: 0;
    height: 25px;
    border-left: 4px solid var(--main-text-color);
    border-radius: 4px;
    top: 0;
  }

  &:before {
    animation: ${closeOneReverse} 0.85s 1 normal
      cubic-bezier(1, 0.01, 0.46, 1.48);
    transform: translate(-25px, 12.5px) rotate(45deg);
    ${(props: SearchBarProps) =>
      props.closed &&
      css`
        animation: ${closeOne} 0.85s 1 normal cubic-bezier(1, 0.01, 0.46, 1.48);
        transform: translate(-8px, 8px) rotate(45deg);
        height: 0px;
      `}
  }

  &:after {
    animation: ${closeTwoReverse} 0.85s 1 normal
      cubic-bezier(1, 0.01, 0.46, 1.48);
    transform: translate(-25px, 12.5px) rotate(-45deg);

    ${(props: SearchBarProps) =>
      props.closed &&
      css`
        animation: ${closeTwo} 0.85s 1 normal cubic-bezier(1, 0.01, 0.46, 1.48);
        height: 25px;
        transform: translate(0, 37.5px) rotate(-45deg);
      `}
  }
`

export default function SearchBar() {
  const [closed, setClose] = useState<boolean>(true)
  const [query, setQuery] = useState<string>('')
  const history = useHistory()

  let inputRef: HTMLInputElement | null = null

  const handleChange = (event: ChangeEvent) => {
    const target: HTMLInputElement = event.target as HTMLInputElement
    setQuery(target.value || '')
  }

  const handleSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      history.push('/search/' + query)
      setClose(true)
      setQuery('')
    }
  }

  const handleToggleClick = () => {
    setClose(!closed)
    if (closed) {
      inputRef?.focus()
    }
  }

  return (
    <SearchContainer className="searchBtn" closed={closed}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleSubmit}
        ref={(input: HTMLInputElement) => {
          inputRef = input
        }}
      />
      <Toggle closed={closed} onClick={handleToggleClick} />
    </SearchContainer>
  )
}
