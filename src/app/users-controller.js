const db = require('../db')

module.exports = {
  async list(ctx) {
    ctx.body = await db.listUsers()
  },

  async post(ctx) {
    const {email, password} = ctx.request.body
    //TODO validation
    try {
      await db.createUser(email, password)
      ctx.body = {
        message: 'User is created successfully',
      }
    } catch (e) {
      ctx.body = {
        error: e.toString(),
      }
    }
  },
  async delete(ctx) {
    const deleted = await db.deleteUser(ctx.params.id)
    if (deleted) {
      ctx.body = {
        message: 'Deleted successfully',
        id: deleted.id,
      }
    } else {
      ctx.throw(404, 'Resource is not found.')
    }
  },
  async quota(ctx) {
    await db.setQuota(ctx.query.id, ctx.request.body.quota)
    ctx.body = {
      message: 'Quota is updated.'
    }
  },
}

