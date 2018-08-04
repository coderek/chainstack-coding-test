const usersController = require('./users-controller')
const resourcesController = require('./resources-controller')
const authenticate = require('./authenticate')
const Router = require('koa-router')

const routes = [
  ['/auth', 'POST', authenticate],

  // users
  ['/resources', 'POST', resourcesController.post, ['normal']],
  ['/resources', 'GET', resourcesController.list, ['normal']],
  ['/resources/:id', 'GET', resourcesController.get, ['normal']],
  ['/resources/:id', 'DELETE', resourcesController.delete, ['normal']],

  // admin only
  ['/users', 'POST', usersController.post, ['admin']],
  ['/users', 'GET', usersController.list, ['admin']],
  ['/users/:id', 'GET', usersController.get, ['admin']],
  ['/users/:id', 'DELETE', usersController.delete, ['admin']],

  // admin only
  ['/users/:id/quota', 'PUT', usersController.quota, ['admin']],
]

const rolesImplications = {
  'admin': ['normal'],
}

function getImpliedRoleSet(role) {

  function dfs(visitedSet, target) {
    if (visitedSet.has(target))
      return
    visitedSet.add(target)
    for (const edge of (rolesImplications[target] || [])) {
      dfs(visitedSet, edge)
    }
  }

  const roleSet = new Set()
  dfs(roleSet, role)

  return roleSet
}

const router = new Router()
routes.forEach(([route, method, action, roles]) => {
  router[method.toLowerCase()](route, async (ctx, next) => {
    if (roles && roles.length) {
      const user = await ctx.state.user
      if (!user) {
        ctx.throw(401)
      }
      const impliedRoleSet = getImpliedRoleSet(user.role)
      if (!roles.some(r => impliedRoleSet.has(r))) {
        ctx.throw(401)
      }
    }
    return action.call(null, ctx, next)
  })
})

module.exports = router
