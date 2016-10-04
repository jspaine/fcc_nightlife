export default (url) => {
  let cache = {}

  return async (ctx, next) => {
    if (!ctx.path.match(new RegExp('^' + url)))
      return await next()
    const params = ctx.path.match(new RegExp('^' + url + '\/(.*$)'))[1]
    if (!cache[params] || cache[params].expires < Date.now()) {
      await next()
      cache[params] = {
        expires: Date.now() + 86400000,
        res: ctx.body
      }
    }
    ctx.body = cache[params].res
  }
}
