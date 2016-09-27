import Plan from './model'
import yelpClient from '~/api/yelp/client'

export default {
  index: async (ctx) => {
    ctx.body = await Plan.find()
      .sort({created: 'desc'})
      .populate('owner', {
        username: true,
        image: true
      })
      .lean()
  },

  create: async (ctx) => {
    const newPlan = new Plan(ctx.request.body)
    newPlan.user = ctx.state.user._id

    const plan = await newPlan.save()
    ctx.body = plan
  },

  show: async (ctx) => {
    const plan = await Plan.findOne({_id: ctx.params.id})
      .populate('owner', {
        username: true,
        image: true
      })
      .lean()
    if (!plan) return ctx.status = 404
    ctx.body = plan
  },

  del: async (ctx) => {
    const plan = await Plan.findOne({_id: ctx.params.id})
    if (!plan) return ctx.status = 404
    const {user} = ctx.state
    if (user.role === 'admin' ||
        user._id === plan.user.toString()) {
      await Plan.findOneAndRemove({_id: ctx.params.id})
      ctx.body = plan
    } else {
      ctx.status = 403
    }
  },

  byVenues: async (ctx) => {
    const venues = JSON.parse(ctx.params.venues)
    const plans = await Plan.find({
      'venue.id': {
        '$in': venues
      }
    })
      .populate('user', {
        username: true,
        image: true
      })
      .lean()

    ctx.body = plans
  },

  byUser: async (ctx) => {
    const plans = await Plan.find({'user': ctx.params.user})
      .populate('user', {
        username: true,
        image: true
      })
      .lean()

    ctx.body = plans
  }
}
