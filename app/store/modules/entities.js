import merge from 'lodash.merge'

const initialState = {
  plans: {},
  users: {}
}

export default (state = initialState, action) => {
  if (action.entities) {
    return merge({}, state, action.entities)
  }
  return state
}
