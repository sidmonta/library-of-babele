import React from 'react'
import { DeweyCategory } from '@sidmonta/babelelibrary/build/types'
import { deweySelected } from '../../../store/dewey'
import BookCase from '../bookcase/BookCase'
import { useHistory } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import {FullRow, WrapContainer} from "../../common/structure";
import {useQueryBookcase} from "../../../hooks/BookcaseHooks";

export type WrapBookcaseProps = {
  deweySelect: DeweyCategory | null
}

export default function WrapBookcase(props: WrapBookcaseProps) {
  const deweySelect: DeweyCategory | null = props.deweySelect
  const [, setSelectDeweyCategory] = useRecoilState(deweySelected)
  const history = useHistory()

  const bookcases: DeweyCategory[] = useQueryBookcase(deweySelect ? deweySelect.dewey : null)

  if (bookcases.length <= 0) {
    return <h3>Nessuna sotto categoria Dewey</h3>
  }

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
