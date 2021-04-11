import { ThemeComponentFactory } from '../../context/theme'
import React, { PropsWithChildren } from 'react'

export type TitleProps = {
  className?: string
  size?: number
  color?: string
  vertical?: boolean
  nowrap?: boolean
}

export default function Title(props: PropsWithChildren<TitleProps>) {
  const TitleCom = ThemeComponentFactory<TitleProps>('title/title')
  return <TitleCom {...props} />
}
