import React from 'react'
import './Home.css'
import WrapBookcase from '../../components/bookcaseComponents/wrapbookcase/WrapBookcase'

function Home() {
  return (
    <div className="page-container home">
      <div className="bookcase-container">
        <WrapBookcase deweySelect={null} />

        <div className="quotes bg-overlay">
          <svg className="float-right" viewBox="0 0 512 512" width="30">
            <path
              d="M464 256h-80v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8c-88.4 0-160 71.6-160 160v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-288 0H96v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C71.6 32 0 103.6 0 192v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z"/>
          </svg>
          <p>
            La Biblioteca è illimitata e periodica.<br/>
            Se un eterno viaggiatore la traversasse in una direzione qualsiasi, constaterebbe alla fine dei secoli che gli stessi volumi si ripetono nello stesso disordine
          </p>
          <svg className="float-left" viewBox="0 0 512 512" width="30">
            <path
              d="M464 32H336c-26.5 0-48 21.5-48 48v128c0 26.5 21.5 48 48 48h80v64c0 35.3-28.7 64-64 64h-8c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h8c88.4 0 160-71.6 160-160V80c0-26.5-21.5-48-48-48zm-288 0H48C21.5 32 0 53.5 0 80v128c0 26.5 21.5 48 48 48h80v64c0 35.3-28.7 64-64 64h-8c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h8c88.4 0 160-71.6 160-160V80c0-26.5-21.5-48-48-48z"/>
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Home
