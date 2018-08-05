const db = require('./db')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const sessionMiddleware = require('./middlewares/session-middleware')
const router = require('./routes')
const app = new Koa()
const cors = require('@koa/cors');

app.use(cors())
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


app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3001)