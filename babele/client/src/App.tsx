import React  from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import './App.css'
import Home from './views/Home/Home'
import CategoryPage from './views/CategoryPage/CategoryPage'

import NavMenu from './views/Menu/NavMenu'
import SearchResult from './views/SearchResult/SearchResult'
import SearchBar from './components/common/searchbar/SearchBar'
import { ThemeContext, Themes } from './context/theme'
import Title from "./components/common/title/title";
// import {useNewBookHook} from "./store/books";

const appTheme = process.env.REACT_APP_THEME as Themes

function App() {
  // const newbooks = useNewBookHook(console.log)
  return (
    <ThemeContext.Provider value={appTheme}>
      <div className="App">
        <Router>
          <header>
            <Link to="/">
              <Title>Babele's Library</Title>
            </Link>
          </header>
          <main>
            <Switch>
              <Route path="/category/:categoryId">
                <CategoryPage />
              </Route>
              <Route path="/search/:query">
                <SearchResult />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </main>
          <footer>
            <NavMenu />
            <SearchBar />
          </footer>
        </Router>
      </div>
    </ThemeContext.Provider>
  )
}

export default App
