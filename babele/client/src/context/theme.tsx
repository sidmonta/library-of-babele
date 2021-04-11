import React, {
  createContext,
  lazy,
  useContext,
  Suspense,
  PropsWithChildren,
  useMemo,
  ReactNode,
  Component,
} from 'react'

export type Themes = 'real' | 'flat'

export const ThemeContext = createContext<Themes>('real')
export const useTheme = () => useContext(ThemeContext)

export function ThemeComponentFactory<T>(component: string, template?: NonNullable<ReactNode> | null | Component) {
  const theme = useTheme()
  const ThemeComponent = useMemo(() => lazy(() => import(`../components/${component}-${theme}`)), [component, theme])
  const fallback: NonNullable<ReactNode> | null = template ?? <div>...</div>
  return (props: PropsWithChildren<T>) => (
    <Suspense fallback={fallback}>
      <ThemeComponent {...props}>{props.children}</ThemeComponent>
    </Suspense>
  )
}
