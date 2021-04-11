import React from 'react'
import Title from '../../components/title/title'
import WrapBookcase from '../../components/wrapbookcase/WrapBookcase'

function Home() {
  return (
    <div className="page-container">
      <Title className="center-text">Babele's Library</Title>
      <div className="bookcase-container">
        <WrapBookcase deweySelect={null} />
      </div>
    </div>
  )
}

export default Home
