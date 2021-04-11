import styled, { css } from 'styled-components'
import React from 'react'

const HamburgerWrap = styled.div`
  width: 40px;
  height: 25px;
  position: relative;
  margin: 10px auto;
  transform: rotate(0deg);
  transition: 0.5s ease-in-out;
  cursor: pointer;
`

const HamburgerSpan = styled.span`
  display: block;
  position: absolute;
  height: 7px;
  width: 100%;
  background: var(--main-text-color);
  border-radius: 7px;
  opacity: 1;
  left: 0;
  transform: rotate(0deg);
  transition: 0.25s ease-in-out;
`

const HamburgerSpan1 = styled(HamburgerSpan)`
  top: 0px;
  ${(props: { open: boolean }) =>
    props.open &&
    css`
      top: 18px;
      width: 0%;
      left: 50%;
    `}
`

const HamburgerSpan2 = styled(HamburgerSpan)`
  top: 14px;
  ${(props: { open: boolean }) =>
    props.open &&
    css`
      transform: rotate(45deg);
    `}
`

const HamburgerSpan3 = styled(HamburgerSpan)`
  top: 14px;
  ${(props: { open: boolean }) =>
    props.open &&
    css`
      transform: rotate(-45deg);
    `}
`

const HamburgerSpan4 = styled(HamburgerSpan)`
  top: 28px;
  ${(props: { open: boolean }) =>
    props.open &&
    css`
      top: 14px;
      width: 0%;
      left: 50%;
    `}
`

export interface MenuBtnProps {
  onOpen: () => void
  onClose: () => void
  open: boolean
}

export default function MenuBtn(props: MenuBtnProps) {
  const open = props.open

  const toggleMenu = () => {
    if (!open) {
      props.onOpen()
    } else {
      props.onClose()
    }
  }

  return (
    <HamburgerWrap role="button" title="Menu" className="hamburger-btn" onClick={() => toggleMenu()}>
      <HamburgerSpan1 open={open} />
      <HamburgerSpan2 open={open} />
      <HamburgerSpan3 open={open} />
      <HamburgerSpan4 open={open} />
    </HamburgerWrap>
  )
}
