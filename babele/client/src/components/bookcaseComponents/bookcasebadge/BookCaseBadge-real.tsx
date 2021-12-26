import styled from 'styled-components'
export default styled.span`
  position: relative;
  top: 15px;
  left: calc(300px / 2 - 5px);
  background-color: var(--color-red);
  border-radius: 50%;
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  display: inline-flex;
  justify-content: center;
  width: 1.5em;
  color: white;
  height: 1.5em;
  align-items: center;
`
