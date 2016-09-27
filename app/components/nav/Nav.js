import React from 'react'
import {Link} from 'react-router'
import {AppBar} from 'react-toolbox/lib/app_bar'
import {NavDrawer} from 'react-toolbox'
import {Navigation} from 'react-toolbox/lib/navigation'
import {IconButton} from 'react-toolbox/lib/button'
import {Input} from 'react-toolbox/lib/'
import {ProgressBar} from 'react-toolbox/lib/progress_bar'
import LinkStyle from 'react-toolbox/lib/link/theme.scss'
import style from './Nav.scss'

const Nav = ({
  user,
  menuButtonClick,
  searchTerm,
  searchFetching,
  updateSearchTerm
}) =>
  <AppBar className={style.appBar} className={style.fixed} fixed>
    <Link to="/">
      NightLife!
    </Link>
    <Input
      type="text"
      icon="search"
      value={searchTerm}
      onChange={updateSearchTerm}
    />
    {searchFetching && <ProgressBar type="circular" mode="indeterminate" />}
    <Navigation className={style.nav} type="horizontal">
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
