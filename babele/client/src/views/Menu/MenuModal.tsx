import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import {AiOutlineHome} from "react-icons/all";
import Title from "../../components/common/title/title";
import {AbstractSection, DeweySection, LinkSection} from "./MenuSections";

const ModalContainer = styled.div`
  opacity: ${(props: MenuModalProps) => (props.open ? 1 : 0)};
  display: ${(props: MenuModalProps) => (props.open ? 'block' : 'none')};
  position: absolute;
  top: 50%;
  bottom: 0;
  left: 50%;
  right: 0;
  width: 98vw;
  height: 98vh;
  align-items: center;
  justify-content: center;
  background-color: #7FFFD3;
  transform: translate(-50%, -50%);
  transition: opacity 3s;
  z-index: 9;
  overflow-y: auto;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 35px auto;
  grid-template-rows: 35px 1fr auto 1fr;
  padding: 1em;
  grid-row-gap: 3em;

  .sub-title {
    border-bottom: 1px solid rgba(0, 0, 0, 0.46);
    padding-bottom: 5px;
    margin-bottom: 1em;
  }

  .home-icon {
    grid-row: 1 / 1;
    grid-column: 1 / 1;
    font-size: 25px;

    display: flex;
    align-items: center;
    justify-content: center;
    align-content: center;
  }

  .abstract {
    grid-row: 2 / 3;
    grid-column: 2 / -1;

    p {
      margin: 5px;
      line-height: 1.5;
    }
  }

  .infoDewey {
    grid-row: 3 / 4;
    grid-column: 2 / -1;

    .deweyInfo {
      margin: 1em 0;
    }
  }

  .links {
    grid-row: 4 / 5;
    grid-column: 2 / -1;
  }
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
      <Grid>
        <div className="home-icon">
          <Link to="/" onClick={() => handleLinkClick()}>
            <AiOutlineHome />
          </Link>
        </div>
        <div className="title">
          <Title size={36}>Babele's Library</Title>
        </div>
        <div className="abstract">
          <AbstractSection />
        </div>
        <div className="infoDewey">
        <DeweySection />
        </div>
        <div className="links">
          <LinkSection />
        </div>
      </Grid>
    </ModalContainer>
  )
}
