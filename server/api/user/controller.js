import jwt from 'jsonwebtoken'

import User from './model'
import config from '~/config'

export default {
  index: async (ctx) => {
    const users = await User.find()
    ctx.body = users
  },

  show: async (ctx) => {
    if (ownOrAdmin(ctx.params, ctx.state.user))
      ctx.body = await User.findOne({ _id: ctx.params.id })
    else
      ctx.status = 403
  },

  create: async (ctx) => {
    const newUser = new User(ctx.request.body)
    const existingUsers = await User.find({
      username: newUser.username
    })

    if (existingUsers.length === 0) {
      const user = await newUser.save()
      const token = jwt.sign({ _id: user._id, role: user.role}, config.secrets.token)

      ctx.body = {
        id: user._id,
        token
      }
    } else {
      ctx.status = 500
      const usernames = existingUsers.map(u => u.username)
      const error = []
      if (usernames.find(name => name === newUser.username))
        error.push('username taken')
      ctx.body = {error}
    }
  },

  del: async (ctx) => {
    if (ownOrAdmin(ctx.params, ctx.state.user)) {
      ctx.body = await User.findOneAndRemove({ _id: ctx.params.id })
      ctx.status = 200
    } else {
      ctx.status = 403
    }
  },

  me: async (ctx) => {
    const user = await User.findOne({ _id: ctx.state.user._id })
    ctx.body = user
  },

  update: async (ctx) => {
    if (ownOrAdmin(ctx.params, ctx.state.user)) {
      const user = await User.findOne({ _id: ctx.params.id })
      user.password = ctx.request.body.password
      await user.save()
      ctx.status = 200
    } else {
      ctx.status = 403
    }
  }
}

function ownOrAdmin(target, user) {
  return user.role === 'admin' || user._id === target.id
}
