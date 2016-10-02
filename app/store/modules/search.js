import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/throttle'

import api from '../../lib/apiClient'
import {loadPlansRequest} from './plans'

const UPDATE_TERM = 'search/UPDATE_TERM'
const SET_FETCHING = 'search/SET_FETCHING'
const LOAD_RESULTS_SUCCESS = 'search/LOAD_RESULTS_SUCCESS'
const LOAD_RESULTS_FAILURE = 'search/LOAD_RESULTS_FAILURE'
const RESET_ERROR = 'search/RESET_ERROR'

const search = JSON.parse(localStorage.getItem('search'))

const initialState = {
  term: search && search.term || '',
  fetching: false,
  results: search && search.results || [],
  error: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TERM:
      return {
        ...state,
        term: action.term
      }
    case RESET_ERROR:
      return {
        ...state,
        error: null
      }
    case SET_FETCHING:
      return {
        ...state,
        fetching: true
      }
    case LOAD_RESULTS_SUCCESS:
      return {
        ...state,
        fetching: false,
        results: action.results,
        error: null
      }
    case LOAD_RESULTS_FAILURE:
      return {
        ...state,
        fetching: false,
        results: [],
        error: action.error
      }
    default: return state
  }
}

export const updateTerm = (term) => {
  localStorage.removeItem('search')
  return {
    type: UPDATE_TERM,
    term
  }
}

export const resetError = () => ({
  type: RESET_ERROR
})

export const setFetching = () => ({
  type: SET_FETCHING,
})

const loadResultsSuccess = (results, term) => {
  localStorage.setItem('search', JSON.stringify({term, results}))
  return {
    type: LOAD_RESULTS_SUCCESS,
    results: results
  }
}

const loadResultsFailure = (error) => ({
  type: LOAD_RESULTS_FAILURE,
  error
})

export const loadResultsEpic = action$ =>
  action$.ofType(UPDATE_TERM)
    .debounceTime(300)
    .switchMap(action =>
      Observable.merge(
        api.get(`api/yelp/search/${action.term}`)
          .flatMap(results => {
            return Observable.concat(
              Observable.of(loadResultsSuccess(results.businesses, action.term)),
              Observable.of(loadPlansRequest({venues: results.businesses.map(venue => venue.id)}))
            )
          })
          .catch(err => Observable.of(loadResultsFailure(err))),
        Observable.of(setFetching())
      )
    )

export const getTerm = (search) => search.term
export const getResults = (search) => search.results
export const getError = (search) => search.error
export const getFetching = (search) => search.fetching
