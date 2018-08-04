const db = require('../db')

module.exports = async function (ctx, next) {
  Object.defineProperty(ctx.state, 'user', {
    get() {
      // Lazy loading user
      const auth = ctx.headers.authorization || ''
      const match = auth.match(/Bearer (.+)/)
      if (match) {
        return db.getUserBySession(match[1]).then(u => {
          if (!u || u.expires_at.valueOf() < Date.now()) {
            return null
          }
          return u
        })
      }
    },
  })
  await next()
}
