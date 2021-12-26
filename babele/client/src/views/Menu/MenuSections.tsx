import Title from "../../components/common/title/title";
import React from "react";
import DeweyClassInfo, {DeweyClass, deweyDescription} from "./DeweyInfo";

export function AbstractSection() {
  return (
    <>
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
    </>
  )
}

export function DeweySection() {
  return (
    <>
      <Title size={18} className="sub-title">Definzione Dewey</Title>
      <div className="dewey-container">
        {(Object.keys(deweyDescription) as DeweyClass[]).map((key: DeweyClass) => <DeweyClassInfo key={key} deweyClass={key} />)}
      </div>
    </>
  )
}

export function LinkSection() {
  return <>
    <Title size={14} className="sub-title">Link utili</Title>
    ciao
  </>
}
