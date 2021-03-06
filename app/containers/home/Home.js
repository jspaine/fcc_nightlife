import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

import {removeDuplicateEvents} from 'lib/helpers'
import {PlanList} from 'components'
import {loadPlansRequest, savePlanRequest, deletePlanRequest} from 'store/modules/plans'
import {selectors} from 'store/modules'
import style from './Home.scss'

const stateToProps = (state) => ({
  plansByCreated: selectors.getPlansByCreated(state),
  plansByTime: selectors.getPlansByTime(state),
  plansByUser: (user) => selectors.getPlansByUser(state, user),
  user: selectors.getCurrentUser(state)
})

const dispatchToProps = (dispatch) => ({
  loadPlans: (query) => dispatch(loadPlansRequest(query)),
  savePlan: (plan) => dispatch(savePlanRequest(plan)),
  deletePlan: (planId) => dispatch(deletePlanRequest(planId))
})

class Home extends React.Component {
  componentDidMount() {
    this.props.loadPlans()
    if (this.props.currUser) {
      this.props.loadPlans({user: this.props.user._id})
    }
  }
  render() {
    const {user, plansByTime, plansByUser, plansByCreated} = this.props
    const coming = removeDuplicateEvents(plansByTime).slice(0, 5)
    const users = user ? removeDuplicateEvents(plansByUser(user._id)) : []
    const recent = removeDuplicateEvents(plansByCreated).slice(0, 5)
    return (
      <div>
        {user && users.length > 0 &&
          <div>
            <h4 className={style.heading}>My Plans</h4>
            <PlanList
              plans={users.slice(0, 5)}
              savePlan={this.props.savePlan}
              deletePlan={this.props.deletePlan}
              usersPlans={users}
            />
          </div>
        }
        <div>
          <h4 className={style.heading}>Just Added</h4>
          <PlanList
            plans={recent}
            savePlan={this.props.savePlan}
            deletePlan={this.props.deletePlan}
            user={user}
            usersPlans={users}
          />
        </div>
        <div>
          <h4 className={style.heading}>Coming Up</h4>
          <PlanList
            plans={coming}
            savePlan={this.props.savePlan}
            deletePlan={this.props.deletePlan}
            user={user}
            usersPlans={users}
          />
        </div>
      </div>
    )
  }

  static propTypes = {

  }
}

export default connect(stateToProps, dispatchToProps)(Home)
