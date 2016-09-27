import Router from 'koa-router'

import controller from './controller'
import auth from '~/lib/authService'

const router = new Router()

router.get('/', controller.index)
router.post('/', auth.isAuthenticated, controller.create)
router.get('/:id', controller.show)
router.del('/:id', auth.isAuthenticated, controller.del)
router.get('/byvenues/:venues', controller.byVenues)
router.get('/byuser/:user', controller.byUser)

export default router
