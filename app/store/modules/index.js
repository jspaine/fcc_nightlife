import {combineReducers} from 'redux'
import {combineEpics} from 'redux-observable'
import {routerReducer as routing} from 'react-router-redux'

import auth, * as fromAuth from './auth'
import plans, * as fromPlans from './plans'
import users, * as fromUsers from './users'
import search, * as fromSearch from './search'
import ui from './ui'
import entities from './entities'

export const rootReducer = combineReducers({
  auth,
  plans,
  users,
  search,
  entities,
  ui,
  routing
})

export const rootEpic = combineEpics(
  fromAuth.loginEpic,
  fromPlans.loadPlansEpic,
  fromPlans.savePlanEpic,
  fromPlans.deletePlanEpic,
  fromUsers.loadUsersEpic,
  fromUsers.saveUserEpic,
  fromUsers.deleteUserEpic,
  fromSearch.loadResultsEpic
)

export const selectors = {
  getAllPlans(state) {
    return fromPlans.getAll(state.plans, state.entities)
  },
  getPlanById(state, id) {
    return fromPlans.getById(id, state.plans, state.entities)
  },
  getPlansByVenue(state, venueId) {
    return fromPlans.getByVenue(venueId, state.plans, state.entities)
  },
  getPlansByTime(state) {
    return fromPlans.getByTime(state.plans, state.entities)
  },
  getPlansByUser(state, userId) {
    return fromPlans.getByUser(userId, state.plans, state.entities)
  },
  getPlansByVenueGroupByTime(state, venueId) {
    return fromPlans.getByVenueGroupByTime(venueId, state.plans, state.entities)
  },
  getPlansPending(state) {
    return fromPlans.getPending(state.plans)
  },
  getAllUsers(state) {
    return fromUsers.getAll(state.users, state.entities)
  },
  getUserId(state) {
    return fromAuth.getUserId(state.auth)
  },
  getCurrentUser(state) {
    return fromAuth.getUser(state.auth)
  },
  getSearchTerm(state) {
    return fromSearch.getTerm(state.search)
  },
  getSearchResults(state) {
    return fromSearch.getResults(state.search)
  },
  getSearchError(state) {
    return fromSearch.getError(state.search)
  },
  getSearchFetching(state) {
    return fromSearch.getFetching(state.search)
  }
}
