import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'
import Home from './views/Home/Home'
import CategoryPage from './views/CategoryPage/CategoryPage'

import NavMenu from './components/menu/NavMenu'
import SearchResult from './views/SearchResult/SearchResult'
import SearchBar from './components/searchbar/SearchBar'
import { ThemeContext, Themes } from './context/theme'

const appTheme = process.env.REACT_APP_THEME as Themes

function App() {
  return (
    <ThemeContext.Provider value={appTheme}>
      <div className="App">
        <Router>
          <header>
            <NavMenu />
          </header>
          <main>
            <Switch>
              <Route path="/">
                <Home />
              </Route>
              <Route path="category/:categoryId">
                <CategoryPage />
              </Route>
              <Route path="search/:query">
                <SearchResult />
              </Route>
            </Switch>
          </main>
          <footer>
            <SearchBar />
          </footer>
        </Router>
      </div>
    </ThemeContext.Provider>
  )
}

export default App
