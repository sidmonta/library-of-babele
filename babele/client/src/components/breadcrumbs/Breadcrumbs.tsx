import React from 'react'
import { DeweyCategory } from '@sidmonta/babelelibrary/build/types'
import { Link } from 'react-router-dom'
import { AiFillHome } from 'react-icons/ai'
import styled from 'styled-components'

const Item = styled.li`
  display: inline;

  span {
    display: block;
    float: left;
    height: 40px;
    background: #f3f5fa;

    text-align: center;
    padding: 20px 10px 0 50px;
    position: relative;
    margin: 0 10px 0 0;

    font-size: 18px;
    text-decoration: none;

    &:after {
      content: '';
      border-top: 30px solid transparent;
      border-bottom: 30px solid transparent;
      border-left: 30px solid #f3f5fa;
      position: absolute;
      right: -30px;
      top: 0;
      z-index: 1;
    }
    &:before {
      content: '';
      border-top: 30px solid transparent;
      border-bottom: 30px solid transparent;
      border-left: 30px solid var(--main-bg-color);
      position: absolute;
      left: 0;
      top: 0;
    }
  }
`

const List = styled.ul`
  list-style: none;
  display: inline-table;
`

type BreadcrumbsProps = {
  dewey: DeweyCategory | null
}

const printHierarchy = (dewey: DeweyCategory) => {
  return dewey.hierarchy.map((d) => (
    <Item key={d.dewey}>
      <span>
        <Link to={'/category/' + d.dewey}>{d.name}</Link>
      </span>
    </Item>
  ))
}

export default function Breadcrumbs(props: BreadcrumbsProps) {
  const { dewey } = props
  if (!dewey) {
    return <span>No dewey</span>
  }
  return (
    <List>
      <Item>
        <span>
          <Link to="/">
            <AiFillHome />
          </Link>
        </span>
      </Item>
      {printHierarchy(dewey)}
      <Item>
        <span>{dewey.name}</span>
      </Item>
    </List>
  )
}
