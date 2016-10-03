import React from 'react'
import {Link} from 'react-router'
import {AppBar} from 'react-toolbox/lib/app_bar'
import {NavDrawer} from 'react-toolbox'
import {Navigation} from 'react-toolbox/lib/navigation'
import {IconButton} from 'react-toolbox/lib/button'
import LinkStyle from 'react-toolbox/lib/link/theme.scss'

import {SearchField} from 'components'

import style from './Nav.scss'
import AppBarTheme from './AppBarTheme.scss'

const Nav = ({
  user,
  menuButtonClick,
  searchTerm,
  searchFetching,
  updateSearchTerm,
  route
}) =>
  <AppBar theme={AppBarTheme} fixed>
    <Link
      to="/"
      className={style.home}
      onClick={() => updateSearchTerm('')}
    >
      NightLife!
    </Link>
    {route === '/' &&
      <SearchField
        className={style.searchField}
        searchTerm={searchTerm}
        searchFetching={searchFetching}
        updateSearchTerm={updateSearchTerm}
      />
    }
    <Navigation
      className={style.nav}
      type="horizontal"
    >
      {user ?
        <IconButton
          inverse icon='more_vert'
          onClick={menuButtonClick}
        /> :
        <Link className={LinkStyle.link} to="/login">Login</Link>
      }
    </Navigation>
  </AppBar>

export default Nav
