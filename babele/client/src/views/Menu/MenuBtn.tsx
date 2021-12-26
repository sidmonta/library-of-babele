import {AiOutlineCloseCircle, AiOutlineInfoCircle} from 'react-icons/ai'
import React from 'react'
import styled from "styled-components";

const InfoBtn = styled(AiOutlineInfoCircle)`
  position: fixed;
  font-size: var(--default-main-btn-size);
  cursor: pointer;
  z-index: 10;
  left: 20px;
  bottom: 20px;
`

const CloseBtn = styled(AiOutlineCloseCircle)`
  position: fixed;
  font-size: var(--default-main-btn-size);
  cursor: pointer;
  z-index: 10;
  left: 20px;
  bottom: 20px;
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

  if (!open) {
    return <InfoBtn className={'info-btn'} onClick={() => toggleMenu()}/>
  } else {
    return <CloseBtn className={'info-btn'} onClick={() => toggleMenu()} />
  }
}
