import Koa from 'koa'
import Router from 'koa-router'
import bodyparser from 'koa-bodyparser'
import serve from 'koa-static'
import compress from 'koa-compress'
import conditional from 'koa-conditional-get'
import etag from 'koa-etag'
import convert from 'koa-convert'
import passport from 'koa-passport'
import koajwt from 'koa-jwt'
import mongoose from 'mongoose'

import webpackDevProxy from './lib/webpackDevProxy'
import cache from './lib/cache'
import webpackConfig from '../webpack.config'
import config from './config'
import seedDb from './lib/seedDb'
import apiRoutes from './api'

const env = process.env.NODE_ENV || 'development'

mongoose.Promise = global.Promise
mongoose.connect(config.db.uri, config.db.options)
if (config.db.seed) seedDb()
//if (env === 'test') mongoose.set('debug', true)

const app = new Koa()
app.use(conditional())
app.use(etag())
app.use(compress())
app.use(bodyparser())

if (env !== 'production') {
  app.use(async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      ctx.status = err.status || 500
      ctx.body = err.message
      ctx.app.emit('error', err, ctx)
    }
  })
}

app.use(koajwt({
  secret: config.jwt,
  passthrough: true,
  cookie: 'token'
}))

app.use(cache('\/api\/yelp'))

app.use(passport.initialize())
app.use(apiRoutes.routes())

app.use(async (ctx, next) => {
  if (!ctx.path.match(/\.js(?:on)?$|\.html$|\.(?:s)?css$|\.map$|\.ico$/)) {
    ctx.path = '/'
  }
  await next()
})

if (env === 'production') {
  app.use(serve('public'))
} else {
  app.use(convert(webpackDevProxy(webpackConfig.devServer.port)))
}

app.listen(config.port, config.host, () => {
  console.log(`server listening on ${config.protocol}://${config.host}:${config.port}`)
})

export default app
