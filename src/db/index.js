const {Client} = require('pg')
const moment = require('moment')

const client = new Client({
  user: 'cs',
  host: '0.0.0.0',
  database: 'chainstack',
  password: 'abc',
  port: 5434,
})
client.connect()

module.exports = {
  getUserBy(condition) {
    const keys = Object.keys(condition)
    return client.query(`
      SELECT * FROM users WHERE ${keys.map((k, i) => k + '=$' + (i + 1)).join(' ')}
    `, keys.map(k => condition[k])).then(result => result.rows[0])
  },
  getUserBySession(sessionId) {
    return client.query(`
      SELECT * FROM sessions s LEFT JOIN users u ON s.user_id = u.id WHERE s.session_id = $1
    `, [sessionId]).then(result => result.rows[0])
  },
  createSession(sessionId, userId) {
    //NOTE move expiry duration to config
    return client.query(
      'INSERT INTO sessions (session_id, user_id, expires_at) VALUES ($1, $2, $3)',
      [sessionId, userId, moment().add(2, 'hours').toDate()])
  },
}