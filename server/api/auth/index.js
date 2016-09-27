import Router from 'koa-router'

import local from './local'
import github from './github'
import google from './google'

import config from '~/config'

const rootUrl = config.env === 'development' ?
  `${config.protocol}://${config.host}:${config.port}` :
  `${config.protocol}://${config.host}`

local.setup()
github.setup(rootUrl)
google.setup(rootUrl)

const router = new Router

router.use('/local', local.router.routes())
router.use('/github', github.router.routes())
router.use('/google', google.router.routes())

export default router
