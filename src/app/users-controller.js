const db = require('../db')

module.exports = {
  async list() {

  },

  get() {
  },

  async post(ctx, next) {
    const {email, password} = ctx.request.body
    //TODO validation
    try {
      await db.createUser(email, password)
      ctx.body = {
        message: 'User is created successfully',
      }
    } catch (e) {
      ctx.body = {
        error: e.toString()
      }
    }
  },
  delete() {
  },
  quota() {

  },
}

