import React from 'react'
import { DeweyCategory } from '@sidmonta/babelelibrary/build/types'
import { Link } from 'react-router-dom'
import { AiFillHome } from 'react-icons/ai'
import styled from 'styled-components'

const Item = styled.li`
  display: inline-block;

  a {
    display: block;
    float: left;


    &:focus {
      outline: thin dotted;
    }

    &:link {
      touch-action: manipulation;
      color: #007c89;
      &:hover {
        background-image: linear-gradient(currentColor, currentColor);
        background-size: auto 1px;
        background-repeat: repeat-x;
        background-position: 0 calc(50% + 1ex);
      }
    }

    &:active,
    &:hover {
      outline: 0;
    }

    &:visited:not([rel=external]) {
      color: currentColor;
    }
  }

  &:nth-last-child(n+2):after {
    display: inline-block;
    content: "​";
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23767676' stroke-width='2' stroke-linecap='round' stroke-linejoin='round%5C'%3E%3Cpolyline points='9 18 15 12 9 6'%3E%3C/polyline%3E%3C/svg%3E") center/16px 16px no-repeat;
    width: 16px;
    margin: 0 8px;
  }
`

const List = styled.ul`
  list-style: none;
  display: flex;
  padding-left: 0;
  margin: 1em 0;
`

type BreadcrumbsProps = {
  dewey: DeweyCategory | null
}

const printHierarchy = (dewey: DeweyCategory) => {
  return dewey.hierarchy.map((d) => (
    <Item key={d.dewey}>
      <Link to={'/category/' + d.dewey}><span>{d.name}</span></Link>
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
          <Link to="/">
            <AiFillHome />
          </Link>
        </Item>
        {printHierarchy(dewey)}
        <Item><span>{dewey.name}</span></Item>
      </List>
  )
}
