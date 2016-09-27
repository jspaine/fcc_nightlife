import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {Input} from 'react-toolbox/lib/input'

import {loadPlansRequest} from 'store/modules/plans'
import {selectors} from 'store/modules'

//import style from './Home.scss'

const stateToProps = (state) => ({
  plans: selectors.getAllPlans(state),
  currUser: selectors.getCurrentUser(state)
})

const dispatchToProps = (dispatch) => ({
  loadPlans: (venues) => dispatch(loadPlansRequest(venues))
})

class Home extends React.Component {
  render() {
    return (
      <div>
      {'fdgdf'}
      </div>
    )
  }

  static propTypes = {

  }
}

export default connect(stateToProps, dispatchToProps)(Home)
