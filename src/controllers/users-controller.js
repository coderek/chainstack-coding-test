const db = require('../db')

module.exports = {
  async list(ctx) {
    ctx.body = await db.listUsers().then(users => users.map(u => {
      delete u.password_hash
      return u
    }))
  },

  async post(ctx) {
    const {email, password, role, quota} = ctx.request.body
    //TODO validation
    try {
      const created = await db.createUser(email, password, role, quota)
      ctx.body = {
        message: 'User is created successfully',
        id: created.id
      }
    } catch (e) {
      ctx.body = {
        error: e.toString(),
      }
      ctx.status = 500
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

