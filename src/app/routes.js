const usersController = require('./users-controller')
const resourcesController = require('./resources-controller')
const authenticate = require('./authenticate')

module.exports = [
  ['/auth', 'POST', authenticate],

  // users
  ['/resources', 'POST', resourcesController.post],
  ['/resources', 'GET', resourcesController.list],
  ['/resources/:id', 'GET', resourcesController.get],
  ['/resources/:id', 'DELETE', resourcesController.delete],

  // admin only
  ['/users', 'POST', usersController.post],
  ['/users', 'GET', usersController.list],
  ['/users/:id', 'GET', usersController.get],
  ['/users/:id', 'DELETE', usersController.delete],

  // admin only
  ['/users/:id/quota', 'PUT', usersController.quota],
]