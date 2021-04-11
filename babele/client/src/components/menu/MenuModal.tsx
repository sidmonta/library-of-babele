import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const ModalContainer = styled.div`
  opacity: ${(props: MenuModalProps) => (props.open ? 1 : 0)};
  display: ${(props: MenuModalProps) => (props.open ? 'flex' : 'none')};
  position: absolute;
  top: 50%;
  bottom: 0;
  left: 50%;
  right: 0;
  width: 98vw;
  height: 98vh;
  align-items: center;
  justify-content: center;
  background-color: red;
  transform: translate(-50%, -50%);
  transition: opacity 3s;
  z-index: 9;
`

export type MenuModalProps = {
  open: boolean
  emitClose?: () => void
}

export default function MenuModal(props: MenuModalProps) {
  const handleLinkClick = () => {
    if (props.emitClose) {
      props.emitClose()
    }
  }

  return (
    <ModalContainer open={props.open}>
      <Link to="/" onClick={() => handleLinkClick()}>
        Home
      </Link>
    </ModalContainer>
  )
}
