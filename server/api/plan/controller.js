import Plan from './model'
import yelpClient from '~/api/yelp/client'

export default {
  index: async (ctx) => {
    ctx.body = await Plan.find({time: {'$gt': Date.now()}})
      .sort({created: 'desc'})
      .populate('user', {
        username: true,
        image: true
      })
      .limit(10)
      .lean()
  },

  create: async (ctx) => {
    const data = ctx.request.body

    const newPlan = new Plan({
      time: data.time,
      venue: data.venue,
      user: ctx.state.user._id
    })

    const savedPlan = await newPlan.save()

    ctx.body = await Plan.findOne({_id: savedPlan._id})
      .populate('user', {
        username: true,
        image: true
      })
      .lean()
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
      '$and': [
        {'venue.id': {
          '$in': venues
        }},
        {'time': {
          '$gt': Date.now()
        }}
      ]
    })
      .populate('user', {
        username: true,
        image: true
      })
      .lean()

    ctx.body = plans
  },

  byUser: async (ctx) => {
    const plans = await Plan.find({
        '$and': [
          {'user': ctx.params.user},
          {'time': {
            '$gt': Date.now()
          }}
        ]
      })
      .populate('user', {
        username: true,
        image: true
      })
      .lean()

    ctx.body = plans
  }
}
