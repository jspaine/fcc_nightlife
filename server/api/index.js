import Router from 'koa-router'
import user from './user'
import plan from './plan'
import auth from './auth'
import yelp from './yelp'

const router = new Router({
  prefix: '/api'
})

router.use('/users', user.routes())
router.use('/plans', plan.routes())
router.use('/auth', auth.routes())
router.use('/yelp', yelp.routes())

export default router
