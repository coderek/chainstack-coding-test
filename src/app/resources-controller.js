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
    const createdId = await db.createResource(name, user.id)
    ctx.body = {
      message: 'Created successfully',
      id: createdId
    }
    // admin has negative quota
    if (user.quota>0) {
      db.setQuota(user.id, user.quota - 1)
    }
  },
  async delete(ctx) {
    const user = await ctx.state.user
    const id = ctx.params.id
    let deletedId = null
    if (user.role === 'admin') {
      deletedId = await db.deleteResource(id)
    } else {
      deletedId = await db.deleteUserResource(id, user.id)
    }
    if (deletedId) {
      ctx.body = {
        message: 'Deleted successfully',
        id,
      }
    } else {
      ctx.throw(404, 'Resource is not found.')
    }
  },
}

