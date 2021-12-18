import styled, {css, Keyframes, keyframes} from "styled-components";

const leftAnimation = keyframes`
  4% {
    transform: rotateZ(90deg);
  }
  10%, 40% {
    transform: rotateZ(0deg);
  }
  46%, 54% {
    transform: rotateZ(90deg);
  }
  60%, 90% {
    transform: rotateZ(0deg);
  }
  96% {
    transform: rotateZ(90deg);
  }
`

const rightAnimation = keyframes`
  4% {
    transform: rotateZ(-90deg);
  }
  10%, 40% {
    transform: rotateZ(0deg);
  }
  46%, 54% {
    transform: rotateZ(-90deg);
  }
  60%, 90% {
    transform: rotateZ(0deg);
  }
  96% {
    transform: rotateZ(-90deg);
  }
`

const bookAnimation = keyframes`
  4% {
    transform: rotateZ(-90deg);
  }
  10%, 40% {
    transform: rotateZ(0deg);
    transform-origin: 2px 2px;
  }
  40.01%, 59.99% {
    transform-origin: 30px 2px;
  }
  46%, 54% {
    transform: rotateZ(90deg);
  }
  60%, 90% {
    transform: rotateZ(0deg);
    transform-origin: 2px 2px;
  }
  96% {
    transform: rotateZ(-90deg);
  }
`

const pagesAnimations: Keyframes[] = []
for (let i = 0; i < 19; i++) {
  const delay = i * 1.86;
  const delayAfter = i * 1.74;
  pagesAnimations.push(keyframes`
    ${4 + delay}% {
      transform: rotateZ(0deg) translateX(-18px);
    }
    ${13 + delayAfter}%,
    ${54 + delay}% {
      transform: rotateZ(180deg) translateX(-18px);
    }
    ${63 + delayAfter}% {
      transform: rotateZ(0deg) translateX(-18px);
    }
  `)
}

const assignAnimation = () => pagesAnimations.map((animation, index) => css`
      &:nth-child(${index + 1}) {
        animation-name: ${animation};
      }
    `
)

const Book = styled.div<{ duration?: string, color?: string, size?: number }>`
  width: 32px;
  height: 12px;
  position: relative;
  margin: 32px 0 0 0;
  zoom: ${props => props.size || 1};

  .inner {
    width: 32px;
    height: 12px;
    position: relative;
    transform-origin: 2px 2px;
    transform: rotateZ(-90deg);
    animation: ${bookAnimation} ${props => props.duration || '6.8s'} ease infinite;

    .left,
    .right {
      width: 60px;
      height: 4px;
      top: 0;
      border-radius: 2px;
      background: ${props => props.color || '#FFF'};
      position: absolute;

      &:before {
        content: '';
        width: 48px;
        height: 4px;
        border-radius: 2px;
        background: inherit;
        position: absolute;
        top: -10px;
        left: 6px;
      }
    }

    .left {
      right: 28px;
      transform-origin: 58px 2px;
      transform: rotateZ(90deg);
      animation: ${leftAnimation} ${props => props.duration || '6.8s'} ease infinite;
    }

    .right {
      left: 36px;
      top: 1px;
      transform-origin: 2px 2px;
      transform: rotateZ(-90deg);
      animation: ${rightAnimation} ${props => props.duration || '6.8s'} ease infinite;
    }

    .middle {
      width: 32px;
      height: 12px;
      border: 4px solid ${props => props.color || '#FFF'};
      border-top: 0;
      border-radius: 0 0 9px 9px;
      transform: translateY(2px);
    }
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    position: absolute;
    left: 50%;
    top: 0;

    li {
      height: 4px;
      border-radius: 2px;
      transform-origin: 100% 2px;
      width: 48px;
      right: 0;
      top: -10px;
      position: absolute;
      background: ${props => props.color || '#FFF'};
      transform: rotateZ(0deg) translateX(-18px);
      animation-duration: ${props => props.duration || '6.8s'};
      animation-timing-function: ease;
      animation-iteration-count: infinite;

      ${assignAnimation()}
    }
  }
`

export default function BookLoader(props: { duration?: string, color?: string, size?: number }) {
  return (
    <Book {...props}>
      <div className="inner">
        <div className="left" />
        <div className="middle" />
        <div className="right" />
      </div>
      <ul>
        {pagesAnimations.map((_, i) => <li key={i} />)}
      </ul>
    </Book>
  )
}
