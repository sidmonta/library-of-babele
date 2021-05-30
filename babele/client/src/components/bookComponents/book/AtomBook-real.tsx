import styled from 'styled-components'

function contrastingColor(color: string) {
  const luma = () => {
    const rgb = hexToRGBArray()
    return (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2])
  }

  const hexToRGBArray = () => {
    return [
      parseInt(color.substr(0, 2), 16),
      parseInt(color.substr(2, 2), 16),
      parseInt(color.substr(4, 2), 16)
    ]
  }

  return (luma() >= 165) ? '000' : 'fff';
}

const BookCover = styled.div`
  background-color: ${(props) => props.color || 'red'};
  width: 100%;
  height: 100%;
  cursor: pointer;

  color: #${(props) => contrastingColor(props.color?.replace('#', '') || 'FF0000')};

  display: flex;
  padding: 15px 0 0 5px;
  border-radius: 10px;
  transition: 0.4s ease-out;
  position: relative;
  left: 0;
  box-shadow: -5px 0 9px 0 #7171716e;

  &:not(:first-child) {
    margin-left: -50px;
  }

  &:hover {
    transform: translateX(-40px);
    transition: 0.4s ease-out;
  }

  &:hover ~ & {
    position: relative;
    left: 50px;
    transition: 0.4s ease-out;
  }
`

export default BookCover
