import React from 'react'
import WrapBookcase from '../../components/bookcaseComponents/wrapbookcase/WrapBookcase'
import QuoteWrapper from "../../components/common/QuotesWrapper";
import {css} from "styled-components";

const homeCss = css`
  display: flex;
  align-items: center;
  margin-top: -5%;
`

function Home() {
  return (
    <div className={"page-container " + homeCss}>
      <div className="bookcase-container">
        <WrapBookcase deweySelect={null} />
        <QuoteWrapper>
          <p>
            La Biblioteca è illimitata e periodica.<br/>
            Se un eterno viaggiatore la traversasse in una direzione qualsiasi, constaterebbe alla fine dei secoli che gli stessi volumi si ripetono nello stesso disordine
          </p>
        </QuoteWrapper>
      </div>
    </div>
  )
}

export default Home
