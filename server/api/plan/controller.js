import Plan from './model'
import yelpClient from '~/api/yelp/client'

export default {
  index: async (ctx) => {
    const plans = await Plan.find({time: {'$gt': Date.now()}})
      .sort({'createdAt': 'desc'})
      .populate('user', {
        username: true,
        image: true
      })
      .limit(20)
      .lean()

    ctx.body = await countOthers(plans)
  },

  create: async (ctx) => {
    const data = ctx.request.body

    const newPlan = new Plan({
      time: data.time,
      venue: data.venue,
      user: ctx.state.user._id
    })

    const savedPlan = await newPlan.save()

    ctx.body = await countOne(await Plan.findOne({_id: savedPlan._id})
      .populate('user', {
        username: true,
        image: true
      })
      .lean()
    )
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

    ctx.body = await countOthers(plans)
  }
}

async function countOthers(plans) {
  return await Promise.all(
    plans.map(countOne)
  )
}

async function countOne(plan) {
  return {
    ...plan,
    others: await Plan.count({
      '$and': [
        {'time': plan.time},
        {'venue.id': plan.venue.id}
      ]
    }) - 1
  }
}
