import styled from 'styled-components';
import { contrastingColor } from './AtomBook-real';

// source of animation https://codepen.io/HighFlyer/pen/LaXrgV
export const Container = styled.div`
  z-index: 1;
  perspective: 3000px;
`;
export const Book = styled.div`
  position: relative;
  display: block;
  width: 130px;
  height: 180px;
  margin: 5% auto;
  border-radius: 0 10px 10px 0;
  box-shadow: 5px 5px 8px 0 rgba(151, 146, 153, 0.6);
  font-weight: 400;
  transform-style: preserve-3d;
  transition: transform 0.5s;
  cursor: pointer;
  &:hover {
    transform: rotate3d(0, 1, 0, 35deg);
  }
`;

export const Front = styled.div`
  transform-style: preserve-3d;
  transform-origin: 0 50%;
  transition: transform 0.5s;
  transform: translate3d(0, 0, 20px);
  z-index: 10;
  width: 130px;
  height: 180px;
  position: absolute;
  display: block;
  &::after {
    content: '';
    position: absolute;
    top: 1px;
    bottom: 1px;
    left: -1px;
    width: 1px;
  }
`;

export const FrontCover = styled.div.attrs(props => ({
  style: {
    background: props.color,
    color: contrastingColor(props.color?.replace('#', '') || 'FF0000')
  }
}))`
  box-shadow: inset 4px 0 10px rgb(0 0 0 / 10%);
  position: absolute;
  width: 130px;
  height: 180px;
  top: 0;
  left: 0;
  font-size: 11px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  text-align: right;
  padding: 10px 5px 10px 20px;
  box-sizing: border-box;
  border-radius: 0 10px 10px 0;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 10px;
    bottom: 0;
    width: 3px;
    background: rgba(0, 0, 0, 0.1);
    box-shadow: 1px 0 3px rgba(255, 255, 255, 0.1);
  }
`;

export const LeftSide = styled.div.attrs(props => ({
  style: {
    background: props.color + 'd1',
    color: contrastingColor(props.color?.replace('#', '') || 'FF0000')
  }
}))`
  width: 40px;
  left: -20px;
  height: 100%;
  transform: rotate3d(0, 1, 0, -90deg);
  position: absolute;
  display: block;
`;

export const LeftSideContent = styled.div`
  width: 130px;
  height: 40px;
  font-size: 12px;
  line-height: 40px;
  padding-right: 10px;
  text-align: right;
  transform-origin: 0 0;
  transform: rotate(90deg) translateY(-40px);
  padding-left: 16px;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
