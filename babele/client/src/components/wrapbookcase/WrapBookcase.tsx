import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { DeweyCategory } from '@sidmonta/babelelibrary/build/types'
import { deweySelected } from '../../store/dewey'
import { fetchAPI } from '../../services'
import BookCase from '../bookcase/BookCase'
import { useHistory } from 'react-router-dom'
import { useRecoilState } from 'recoil'

const FullRow = styled.div`
  position: relative;
  width: 100vw;
  background-color: antiquewhite;
  left: 3rem;
  margin-left: -5rem;
`

const WrapContainer = styled.div`
  overflow-x: scroll;
  white-space: nowrap;
  padding: 1.5rem 0;
  text-align: center;
`

export type WrapBookcaseProps = {
  deweySelect: DeweyCategory | null
}

const fetchDewey = fetchAPI('GET')

export default function WrapBookcase(props: WrapBookcaseProps) {
  const deweySelect: DeweyCategory | null = props.deweySelect
  const [, setSelectDeweyCategory] = useRecoilState(deweySelected)
  const history = useHistory()

  const [bookcases, setBookcase] = useState<DeweyCategory[]>([])

  useEffect(() => {
    let url = deweySelect ? '/children/' + deweySelect.dewey : '/init'
    const fetchBookCases = async () => {
      try {
        const bookcases: DeweyCategory[] = await fetchDewey(url)
        setBookcase(bookcases)
      } catch (err) {
        console.error(err)
      }
    }

    fetchBookCases().then()
  }, [deweySelect])

  const handleBookcaseClick = (deweySelected: DeweyCategory) => {
    setSelectDeweyCategory(deweySelected)
    history.push('/category/' + deweySelected.dewey)
  }

  const printBookcase = (bookcase: DeweyCategory) => {
    return <BookCase onClick={() => handleBookcaseClick(bookcase)} {...bookcase} key={bookcase.dewey} />
  }

  return (
    <FullRow>
      <WrapContainer>{bookcases.map(printBookcase)}</WrapContainer>
    </FullRow>
  )
}
