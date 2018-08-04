const db = require('../db')

module.exports = async function (ctx, next) {
  let cachedUser = undefined
  Object.defineProperty(ctx.state, 'user', {
    get() {
      if (cachedUser !== undefined) {
        return cachedUser
      }
      // Lazy loading cachedUser
      const auth = ctx.headers.authorization || ''
      const match = auth.match(/Bearer (.+)/)
      if (match) {
        return db.getUserBySession(match[1]).then(u => {
          // Filter out expired session
          if (!u || u.expires_at.valueOf() < Date.now()) {
            cachedUser = null
            return null
          }
          cachedUser = u
          return u
        })
      } else {
        cachedUser = null
      }
    },
    configurable: false
  })
  await next()
}
