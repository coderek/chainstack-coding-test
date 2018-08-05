const usersController = require('./controllers/users-controller')
const resourcesController = require('./controllers/resources-controller')
const authenticate = require('./controllers/authenticate')
const Router = require('koa-router')
const { getImpliedRoleSet } = require('./helpers')
const routes = [
  ['/auth', 'POST', authenticate],

  // users
  ['/resources', 'POST', resourcesController.post, ['normal']],
  ['/resources', 'GET', resourcesController.list, ['normal']],
  ['/resources/:id', 'DELETE', resourcesController.delete, ['normal']],

  // admin only
  ['/users', 'POST', usersController.post, ['admin']],
  ['/users', 'GET', usersController.list, ['admin']],
  ['/users/:id', 'DELETE', usersController.delete, ['admin']],

  // admin only
  ['/users/:id/quota', 'PUT', usersController.quota, ['admin']],
]

const rolesImplications = {
  'admin': ['normal'],
}

const router = new Router()
routes.forEach(([route, method, action, roles]) => {
  router[method.toLowerCase()](route, async (ctx, next) => {
    if (roles && roles.length) {
      const user = await ctx.state.user
      if (!user) {
        ctx.throw(401)
      }
      const impliedRoleSet = getImpliedRoleSet(user.role, rolesImplications)
      if (!roles.some(r => impliedRoleSet.has(r))) {
        ctx.throw(401)
      }
    }
    return action.call(null, ctx, next)
  })
})

module.exports = router
