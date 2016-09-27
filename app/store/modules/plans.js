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
      const url = action.query.user ?
          `api/plans/byuser/${action.query.user}` :
          `api/plans/byvenues/${JSON.encode(action.query.venues || [])}`
      return api.get(url, {schema: schema.arrayOfPlans})
        .map(loadPlansSuccess)
        .catch(err => Observable.of(loadPlansFailure(err)))
    })

 export const savePlanEpic = action$ =>
  action$.ofType(SAVE_PLAN_REQUEST)
    .mergeMap(action => {
      if (action.plan._id) {
        return api.put(`api/plans/${action.plan._id}`, {
          data: action.plan,
          schema: schema.plan
        })
          .flatMap(data =>
            Observable.concat(
              Observable.of(push(`/plans/${data.result}`)),
              Observable.of(savePlanSuccess(data))
            )
          )
          .catch(err => Observable.of(savePlanFailure(err)))
      }
      return api.post('api/plans', {
        data: action.plan,
        schema: schema.plan
      })
        .flatMap(data =>
          Observable.concat(
            Observable.of(push(`/plans/${data.result}`)),
            Observable.of(savePlanSuccess(data))
          )
        )
        .catch(err => Observable.of(savePlanFailure(err)))
    })

export const deletePlanEpic = action$ =>
  action$.ofType(DELETE_PLAN_REQUEST)
    .mergeMap(action =>
      api.del(`api/plans/${action.id}`, {
        schema: schema.plan
      })
        .map(deletePlanSuccess)
        .catch(err => Observable.of(deletePlanFailure(err)))
    )

export const getAllPlans = (plans, entities) =>
  denormalize([...plans.ids], entities, schema.arrayOfPlans)

export const getPlanById = (id, plans, entities) => {
  if (!plans.ids.has(id)) return
  return denormalize(id, entities, schema.plan)
}

export const getIsPending = (state) => state.pending
