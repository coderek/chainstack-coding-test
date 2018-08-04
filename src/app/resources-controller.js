const db = require('../db')
module.exports = {
  async list(ctx) {
    const user = await ctx.state.user
    if (user.role === 'admin') {
      if (ctx.query.user_id) {
        ctx.body = await db.listUserResources(ctx.query.user_id)
      } else {
        ctx.body = await db.listResources()
      }
    } else {
      ctx.body = await db.listUserResources(user.id)
    }
  },
  async post(ctx) {
    const user = await ctx.state.user
    if (user.quota === 0) {
      ctx.throw(429, 'Quota is reached')
    }
    const { name } = ctx.request.body
    const created = await db.createResource(name, user.id)
    ctx.body = {
      message: 'Created successfully',
      id: created.id
    }
    // admin has negative quota
    if (user.quota>0) {
      await db.setQuota(user.id, user.quota - 1)
    }
  },
  async delete(ctx) {
    const user = await ctx.state.user
    const id = ctx.params.id
    let deleted = null
    if (user.role === 'admin') {
      deleted = await db.deleteResource(id)
    } else {
      deleted = await db.deleteUserResource(id, user.id)
    }
    if (deleted) {
      ctx.body = {
        message: 'Deleted successfully',
        id: deleted.id
      }
    } else {
      ctx.throw(404, 'Resource is not found.')
    }
  },
}

