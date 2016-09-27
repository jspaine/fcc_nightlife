import {Schema, arrayOf} from 'normalizr'

export const venue = new Schema('venues')
export const plan = new Schema('plans', {idAttribute: '_id'})
export const user = new Schema('users', {idAttribute: '_id'})
export const arrayOfVenues = arrayOf(venue)
export const arrayOfUsers = arrayOf(user)
export const arrayOfPlans = arrayOf(plan)

plan.define({
  user,
  venue
})
