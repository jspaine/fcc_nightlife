import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/concat'
import {push} from 'react-router-redux'
import {denormalize} from 'denormalizr'

import api from '../../lib/apiClient'
import * as schema from '../schema'

const LOAD_PLANS_REQUEST = 'plans/LOAD_PLANS_REQUEST'
export const LOAD_PLANS_SUCCESS = 'plans/LOAD_PLANS_SUCCESS'
const LOAD_PLANS_FAILURE = 'plans/LOAD_PLANS_FAILURE'

const SAVE_PLAN_REQUEST = 'plans/SAVE_PLAN_REQUEST'
export const SAVE_PLAN_SUCCESS = 'plans/SAVE_PLAN_SUCCESS'
const SAVE_PLAN_FAILURE = 'plans/SAVE_PLAN_FAILURE'

const DELETE_PLAN_REQUEST = 'plans/DELETE_PLAN_REQUEST'
export const DELETE_PLAN_SUCCESS = 'plans/DELETE_PLAN_SUCCESS'
const DELETE_PLAN_FAILURE = 'plans/DELETE_PLAN_FAILURE'

const initialState = {
  ids: new Set
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_PLANS_REQUEST:
    case SAVE_PLAN_REQUEST:
    case DELETE_PLAN_REQUEST:
      return {
        ...state,
        pending: true,
        error: null,
      }
    case LOAD_PLANS_SUCCESS:
      return {
        ...state,
        pending: false,
        ids: new Set([
          ...state.ids,
          ...action.result
        ])
      }
    case SAVE_PLAN_SUCCESS:
      return {
        ...state,
        pending: false,
        ids: new Set([
          action.result,
          ...state.ids
        ])
      }
    case DELETE_PLAN_SUCCESS:
      return {
        ...state,
        pending: false,
        ids: new Set(
          [...state.ids].filter(id => id !== action.result)
        )
      }
    case LOAD_PLANS_FAILURE:
    case SAVE_PLAN_FAILURE:
    case DELETE_PLAN_FAILURE:
      return {
        ...state,
        pending: false,
        error: action.error
      }
    default: return state
  }
}

export const loadPlansRequest = (query) => ({
  type: LOAD_PLANS_REQUEST,
  query
})

const loadPlansSuccess = (response) => {
  const {entities, result} = response
  return {
    type: LOAD_PLANS_SUCCESS,
    entities,
    result
  }
}

const loadPlansFailure = (error) => ({
  type: LOAD_PLANS_FAILURE,
  error
})

export const savePlanRequest = (plan) => ({
  type: SAVE_PLAN_REQUEST,
  plan
})

const savePlanSuccess = (response) => {
  const {entities, result} = response
  return {
    type: SAVE_PLAN_SUCCESS,
    entities,
    result
  }
}

const savePlanFailure = (error) => ({
  type: SAVE_PLAN_FAILURE,
  error
})

export const deletePlanRequest = (id) => ({
  type: DELETE_PLAN_REQUEST,
  id
})

const deletePlanSuccess = (response) => {
  const {result, entities} = response
  return {
    type: DELETE_PLAN_SUCCESS,
    result,
    entities
  }
}

const deletePlanFailure = (error) => ({
  type: DELETE_PLAN_FAILURE,
  error
})

export const loadPlansEpic = action$ =>
  action$.ofType(LOAD_PLANS_REQUEST)
    .mergeMap(action => {
      let url
      const {query} = action
      if (!query) {
        url = 'api/plans'
      } else if (query.user) {
        url = `api/plans/byuser/${query.user}`
      } else {
        url = `api/plans/byvenues/${JSON.stringify(query.venues || [])}`
      }
      return api.get(url, {schema: schema.arrayOfPlans})
        .map(loadPlansSuccess)
        .catch(err => Observable.of(loadPlansFailure(err)))
    })

export const savePlanEpic = action$ =>
  action$.ofType(SAVE_PLAN_REQUEST)
    .mergeMap(action => api.post('api/plans', {
        data: action.plan,
        schema: schema.plan
      })
        .map(savePlanSuccess)
        .catch(err => {
          console.error('savePlan error', err)
          return Observable.of(savePlanFailure(err))
        })
    )

export const deletePlanEpic = action$ =>
  action$.ofType(DELETE_PLAN_REQUEST)
    .mergeMap(action =>
      api.del(`api/plans/${action.id}`, {
        schema: schema.plan
      })
        .map(deletePlanSuccess)
        .catch(err => Observable.of(deletePlanFailure(err)))
    )

export const getAll = (plans, entities) =>
  plans ? denormalize([...plans.ids], entities, schema.arrayOfPlans) : []

export const getById = (id, plans, entities) => {
  if (!plans.ids.has(id)) return
  return denormalize(id, entities, schema.plan)
}

export const getByVenue = (venueId, plans, entities) =>
  venueId && getAll(plans, entities)
    .filter(plan => plan.venue.id === venueId)

export const getByTime = (plans, entities) =>
  groupBy(getAll(plans, entities), 'time')

export const getByUser = (userId, plans, entities) =>
  userId && getAll(plans, entities)
    .filter(plan => plan.user._id === userId)

export const getByVenueGroupByTime = (venueId, plans, entities) =>
  groupBy(getByVenue(venueId, plans, entities), 'time')

export const getPending = (state) => state.pending

function groupBy(xs, key) {
  return xs.reduce(function (rv, x) {
    let v = key instanceof Function ? key(x) : x[key];
    let el = rv.find((r) => r && r.key === v);
    if (el) {
      el.values.push(x);
    } else {
      rv.push({ key: v, values: [x] });
    }
    return rv;
  }, []).sort((a, b) => {
    if (a.key < b.key) return -1
    if (a.key > b.key) return 1
    return 0
  })
}
