module.exports = {
  async list(ctx, next) {
    const user = await ctx.state.user
    ctx.body = user
  },
  get() {
  },
  post() {
  },
  delete() {
  },
}

