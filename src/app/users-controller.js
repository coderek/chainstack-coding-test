const db = require('../db')

module.exports = {
  list() {
  },

  get() {
  },

  async post(ctx, next) {
    const user = await ctx.state.user
    if (!user || user.role !== 'admin') {
      ctx.throw(401)
    }
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

