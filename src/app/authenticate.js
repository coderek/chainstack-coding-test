const db = require('../db')
const bcrypt = require('bcrypt')
const shortid = require('shortid')

module.exports = async (ctx) => {
  const {email, password} = ctx.request.body
  if (email && password) {
    const user = await db.getUserBy({email})
    if (user) {
      const matched = await bcrypt.compare(password, user.password_hash)

      if (matched) {
        const id = shortid.generate()
        await db.createSession(id, user.id)
        ctx.body = {
          message: 'Authenticated successfully!',
          token: id,
        }
        return
      }
    }
    ctx.body = {
      message: 'Email or password is wrong',
    }
    return
  } else {
    ctx.body = {
      message: 'Require email and password!',
    }
  }
}

