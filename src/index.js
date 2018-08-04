const Koa = require('koa')
const Router = require('koa-router')

const router = new Router()

const app = new Koa()

router.get('/', (ctx, next) => {
  ctx.body = 'hello world'
})

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3001)