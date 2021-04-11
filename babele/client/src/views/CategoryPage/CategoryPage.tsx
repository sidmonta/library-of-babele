import React from 'react'
import { useDewey } from '../../store/dewey'
import { DeweyCategory } from '@sidmonta/babelelibrary/build/types'
import WrapBookcase from '../../components/wrapbookcase/WrapBookcase'
import WoodBookcase from '../../components/woodbookcase/WoodBookcase'
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs'
import WrapBookList from '../../components/wrapbookslist/WrapBooksList'
import { Route, Switch, useRouteMatch, useParams } from 'react-router'
import BookView from '../BookView/BookView'

export default function CategoryPage() {
  let { path } = useRouteMatch()
  const params = useParams<{ categoryId: string }>() || { categoryId: '0' }
  const currentDewey = params.categoryId
  const selectDewey: DeweyCategory | null = useDewey(currentDewey)

  return (
    <div className="page-container">
      <Switch>
        <Route exact path={path}>
          <WrapBookcase deweySelect={selectDewey} />
          <Breadcrumbs dewey={selectDewey} />
          <WoodBookcase title={selectDewey?.name || ''}>
            <div className="wood-book">
              <WrapBookList deweySelect={selectDewey} />
            </div>
          </WoodBookcase>
        </Route>
        <Route path={`${path}/book/:bookUri`}>
          <BookView />
        </Route>
      </Switch>
    </div>
  )
}
