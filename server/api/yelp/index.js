import Router from 'koa-router'
import client from './client'

const router = new Router()

router.get('/search/:term', async (ctx) => {
  ctx.body = await client.search(ctx.params.term, 'nightlife')
})

router.get('/business/:id', async (ctx) => {
  ctx.body = await client.business(ctx.params.id)
})

export default router
