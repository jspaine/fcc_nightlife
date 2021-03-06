import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {Layout, Panel} from 'react-toolbox/lib/layout'

import {openDrawer} from 'store/modules/ui'

import {Nav, VenueList} from 'components'
import {NavDrawer} from 'containers'
import {loginOAuth} from 'store/modules/auth'
import {updateTerm, loadResultsRequest} from 'store/modules/search'
import {loadPlansRequest, savePlanRequest, deletePlanRequest} from 'store/modules/plans'
import {selectors} from 'store/modules'

import style from './App.scss'

const stateToProps = (state) => ({
  user: selectors.getCurrentUser(state),
  searchTerm: selectors.getSearchTerm(state),
  searchResults: selectors.getSearchResults(state),
  searchError: selectors.getSearchError(state),
  searchFetching: selectors.getSearchFetching(state),
  plansByVenue: (venueId) => selectors.getPlansByVenueGroupByTime(state, venueId),
  drawerOpen: state.ui.drawer
})

const dispatchToProps = (dispatch) => ({
  menuClick: () => dispatch(openDrawer()),
  pushState: (loc) => dispatch(push(loc)),
  login: (token) => dispatch(loginOAuth(token)),
  updateSearchTerm: (term) => dispatch(updateTerm(term)),
  savePlan: (plan) => dispatch(savePlanRequest(plan)),
  deletePlan: (planId) => dispatch(deletePlanRequest(planId)),
  loadPlans: (query) => dispatch(loadPlansRequest(query)),
})

class App extends React.Component {
  componentWillMount() {
    const {params, login, pushState, searchTerm, searchResults} = this.props
    if (params.token) {
      login(params.token)
      pushState('/')
    }
    if (searchTerm && searchTerm !== '' && searchResults.length > 0) {
      const venues = searchResults.map(res => res.id)
      this.props.loadPlans({venues})
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      this.props.pushState('/')
    } else if (this.props.user && !nextProps.user) {
      this.props.pushState('/')
    }
  }

  render() {
    return (
      <Layout>
        <Panel className={style.panel}>
          <Nav
            user={this.props.user}
            menuButtonClick={this.props.menuClick}
            searchTerm={this.props.searchTerm}
            searchFetching={this.props.searchFetching}
            updateSearchTerm={this.props.updateSearchTerm}
            route={this.props.location.pathname}
          />
          {this.props.user && <NavDrawer />}
          {(this.props.searchResults.length > 0 && this.props.location.pathname === '/') ?
            <div>
              <h4>Venues in {this.props.searchTerm}</h4>
              <VenueList
                venues={this.props.searchResults}
                plansByVenue={this.props.plansByVenue}
                user={this.props.user}
                savePlan={this.props.savePlan}
                deletePlan={this.props.deletePlan}
              />
            </div> :
            this.props.children
          }
        </Panel>
      </Layout>
    )
  }

  static propTypes = {
    children: PropTypes.node,
    user: PropTypes.object,
    searchTerm: PropTypes.string,
    searchResults: PropTypes.array,
    searchError: PropTypes.object,
    searchFetching: PropTypes.bool,
    drawerOpen: PropTypes.bool,
    menuClick: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    updateSearchTerm: PropTypes.func.isRequired,
    savePlan: PropTypes.func.isRequired,
    deletePlan: PropTypes.func.isRequired,
    loadPlans: PropTypes.func.isRequired
  }
}

export default connect(stateToProps, dispatchToProps)(App)
