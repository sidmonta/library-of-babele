import styled from 'styled-components'

const BookCover = styled.div`
  background-color: ${(props) => props.color || 'red'};
  width: 100%;
  height: 100%;
  box-shadow: 6px 1px 10px 0px #636363;
  cursor: pointer;
  line-height: 1.4;
  padding: 5px;
  text-overflow: ellipsis;
  overflow: hidden;

  &:after {
    content: '';
    text-align: right;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 70%;
    height: 1.4em;
    background: linear-gradient(to right, ${(props) => props.color}0, ${(props) => props.color}1 50%);
  }
`

export default BookCover
