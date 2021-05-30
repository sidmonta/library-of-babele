import styled from 'styled-components'

const BookCover = styled.div`
  background-color: ${(props) => props.color || 'red'};
  width: 55px;
  height: 80px;
  border-radius: 50%;
  border: 1px solid black;
  box-shadow: -3px 3px 10px black;
`

export default BookCover
