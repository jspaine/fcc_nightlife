import React from 'react'
import {push} from 'react-router-redux'
import {IconButton, Button} from 'react-toolbox/lib/button'

import style from './YelpButton.scss'

export default ({id}) =>
  <Button href={`//www.yelp.com/biz/${id}`}>
    <img
      src="https://s3-media2.fl.yelpcdn.com/assets/srv0/developer_pages/95212dafe621/assets/img/yelp-2c.png"
      className={style.image}
    />

  </Button>
