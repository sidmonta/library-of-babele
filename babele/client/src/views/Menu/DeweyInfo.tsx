import React, { useState } from 'react';
import styled from 'styled-components';
import { AiOutlineDown, AiOutlineRight } from 'react-icons/ai';

export type DeweyClass = '000' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

type DeweyDescription = { [key in DeweyClass]: { title: string; desc: string } };
export const deweyDescription: DeweyDescription = {
  '000': {
    title: 'Informatica, informazione e opere generali',
    desc: `È la classe più generale e identifica le risorse che non riguardano una specifica disciplina, ma anzi sono risorse interdisciplinari.
           Si usa anche per le risorse che trattano di conoscenza e dell’informazione e comunicazione generale.`
  },
  '100': {
    title: 'Filosofia e psicologia',
    desc: `La classe tratta le risorse che riguardano di filosofia, psicologia, parapsicologia e occultismo. Come si vede è una classe che copre più discipline e nelle divisioni interne è presente la suddivisione delle singole discipline interessate.`
  },
  '200': {
    title: 'Religione',
    desc: `Questa classe è dedicata alle risorse che si occupano della natura ultima degli esseri e dei loro rapporti, ma a differenza della filosofia, tratta questi soggetti nel contesto di una rivelazione, della divinità e del culto.`
  },
  '300': {
    title: 'Scienze sociali',
    desc: `È una delle classi più ricche e comprende molte discipline e argomenti, come: la sociologia, l’antropologia, la statistica, la scienza politica, l’economia, il diritto, l’educazione, il commercio e i costumi; cioè tutti quegli argomenti che si possono trattare dal punto di vista sociale.`
  },
  '400': {
    title: 'Linguaggio',
    desc: `Le risorse appartenenti a questa classe parlano delle lingue e del loro studio, a partire dal linguaggio in generale fino alle specifiche lingue.`
  },
  '500': {
    title: 'Scienza',
    desc: `La classe è dedicata alle scienze naturali e matematiche. Si sofferma sulle scienze pure come: matematica, fisica, chimica, geologia. Le risorse che la compongono trattano degli aspetti teorici della disciplina, rispetto a quelli pratici che vengono trattati dalla classe 600 Tecnologia.`
  },
  '600': {
    title: 'Tecnologia',
    desc: `Per tecnologia si intende l’uso delle scienze al fine di sfruttare la natura a beneficio dell’umanità. Qui troviamo trattate le discipline quali: medicina, ingegneria, agricoltura, costruzione di edifici ad esempio.`
  },
  '700': {
    title: 'Arti e arti ricreative',
    desc: `La classe contiene gli indici di classificazione per le risorse che parlano di arte in generale, dalle belle arti alle arti decorative, dalla musica e l’esecuzione all’architettura e e la grafica; inoltre tratta anche di musei e gallerie.`
  },
  '800': {
    title: 'Letteratura',
    desc: `La classe in questione include discipline quali la retorica, la prosa, la poesia. La letteratura come disciplina riguarda solo le opere di fantasia scritte nelle varie forme letterarie, la critica e l’analisi letteraria, la storia e la biografia letteraria; il resto della letteratura, come quella popolare oppure le biografie, sono da assegnarsi alle classi corrispondenti all’argomento trattato.`
  },
  '900': {
    title: 'Storia e Geografia',
    desc: `La classe è dedicata alla storia e alla geografia, cioè di risorse che trattano di eventi accaduti o resoconti di situazioni esistenti di un luogo on in un territorio.`
  }
};

export type DeweyClassInfoProps = { deweyClass: DeweyClass };

const DeweyInfoContainer = styled.div`
  margin: 1em 0;
  h4 {
    margin-bottom: 10px;
    cursor: pointer;
    display: flex;

    span {
      margin: 0 5px;
    }

    .thin {
      font-weight: 200;
      letter-spacing: 0.1em;
    }
  }

  p {
    line-height: 1.5;
  }
`;

export default function DeweyClassInfo(props: DeweyClassInfoProps) {
  const deweyInfo = deweyDescription[props.deweyClass];
  const [hidden, setToggle] = useState<boolean>(true);

  const onToggle = () => setToggle(!hidden);

  return (
    <DeweyInfoContainer>
      <h4 onClick={onToggle}>
        {hidden ? <AiOutlineRight /> : <AiOutlineDown />}
        <span>Classe {props.deweyClass} </span>
        <span className={'thin'}>{deweyInfo.title}</span>
      </h4>
      <p hidden={hidden}>{deweyInfo.desc}</p>
    </DeweyInfoContainer>
  );
}
