import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {Input} from 'react-toolbox/lib/input'

import {VenuePlans} from 'components'
import {loadPlansRequest} from 'store/modules/plans'
import {selectors} from 'store/modules'

const stateToProps = (state) => ({
  plansByTime: selectors.getPlansByTime(state),
  plansByUser: selectors.getPlansByUser(state, selectors.getCurrentUser(state)._id),
  currUser: selectors.getCurrentUser(state)
})

const dispatchToProps = (dispatch) => ({
  loadPlans: (query) => dispatch(loadPlansRequest(query))
})

class Home extends React.Component {
  componentDidMount() {
    // this.props.loadPlans()
    // if (this.props.currUser) {
    //   this.props.loadPlans({user: this.props.currUser._id})
    // }
  }
  render() {
    return null
    // const recent = this.props.plansByTime.slice(0, 5)
    // const users = this.props.plansByUser.slice(0, 5)
    // return (
    //   <div>
    //     <VenuePlans
    //       plans={recent}
    //       user={this.props.currUser}
    //     />
    //   </div>
    // )
  }

  static propTypes = {

  }
}

export default connect(stateToProps, dispatchToProps)(Home)
