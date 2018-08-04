const db = require('./db')
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const appRoutes = require('./app/routes')
const sessionMiddleware = require('./middlewares/session-middleware')

const app = new Koa()

app.use(async function (ctx, next) {
  if (!ctx.accepts('application/json')) {
    ctx.throw(400, 'Must accepts type application/json')
  }
  if (['POST', 'PUT', 'PATCH'].includes(ctx.method) && !ctx.is('application/json')) {
    ctx.throw(400, 'Body must be type application/json')
  }
  await next()
})

app.use(bodyParser())
app.use(sessionMiddleware)

const router = new Router()
appRoutes.forEach(([route, method, action]) => {
  router[method.toLowerCase()](route, action)
})

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3001)