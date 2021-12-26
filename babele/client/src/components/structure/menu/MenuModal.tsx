import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import DeweyClassInfo, {deweyDescription, DeweyClass} from "../../../views/Menu/DeweyInfo";
import {AiOutlineHome} from "react-icons/all";
import Title from "../../common/title/title";

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
    grid-column: 2˙ / -1;
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
          <Title size={18} className="sub-title">Abstract</Title>
          <p>
            I Linked Open Data sono un importante strumento di rappresentazione della conoscenza che nel corso degli
            ultimi anni ha visto una crescita smisurata, generando un grande numero di servizi interconnessi che rendono
            tale conoscenza liberamente consultabile. Però il numero elevato di servizi diversi e la difficoltà di
            utilizzo dei LOD rendono questa enorme conoscenza difficile da navigare.
          </p>
          <p>
            Prendendo spunto dal racconto “La Biblioteca di Babele” di Borges il progetto cerca di sviluppare un
            aggregatore di risorse LOD, dandogli la forma di una Biblioteca in cui gli “infiniti” libri contengono la
            conoscenza che le risorse LOD descrivono.
          </p>
          <p>
            I propositi del progetto sono di studiare un meccanismo di organizzazione delle risorse utilizzando i
            criteri di classificazione biblioteconomica per agevolare la navigazione dell’utente attraverso il sistema
            e utilizzare le interconnessioni tra le risorse per aggiungere risorse alla piattaforma durante la
            navigazione dell’utente ed evitare così le difficili interazione con i diversi servizi LOD.
          </p>
        </div>
        <div className="infoDewey" color={'red'}>
          <Title size={18} className="sub-title">Definzione Dewey</Title>
          <div className="dewey-container">
            {(Object.keys(deweyDescription) as DeweyClass[]).map((key: DeweyClass) => <DeweyClassInfo key={key} deweyClass={key} />)}
          </div>
        </div>
        <div className="links">
          ciao
        </div>
      </Grid>
    </ModalContainer>
  )
}
