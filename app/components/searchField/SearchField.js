import React from 'react'
import {Input} from 'react-toolbox/lib/'
import {ProgressBar} from 'react-toolbox/lib/progress_bar'

import style from './SearchField.scss'
import inputTheme from 'theme/searchInput.scss'
import ProgressBarTheme from 'theme/searchProgress.scss'

export default ({
  searchTerm,
  searchFetching,
  updateSearchTerm
}) =>
  <div className={style.searchField}>
    <Input
      theme={inputTheme}
      type="text"
      icon="search"
      value={searchTerm}
      onChange={updateSearchTerm}
    />
    {searchFetching &&
      <ProgressBar
        theme={ProgressBarTheme}
        type="circular"
        mode="indeterminate"
      />
    }
  </div>
