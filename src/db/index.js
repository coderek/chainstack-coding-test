const {Client} = require('pg')
const moment = require('moment')
const bcrypt = require('bcrypt')
const config = require('../config.json')

let dbConfig = null

if (process.env.NODE_ENV === 'test') {
  dbConfig = config.database.test
} else {
  dbConfig = config.database.main
}

const client = new Client({
  ...dbConfig
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
    //TODO move expiry duration to config
    return client.query(
      'INSERT INTO sessions (session_id, user_id, expires_at) VALUES ($1, $2, $3)',
      [sessionId, userId, moment().add(2, 'hours').toDate()])
  },
  createUser(email, password) {
    return client.query(`
      INSERT INTO users (email, password_hash) VALUES
      ($1, $2) RETURNING id
    `, [email, bcrypt.hashSync(password, 10)]).then(result => result.rows[0])
  },
  listUsers() {
    return client.query(`
      SELECT * FROM users
    `).then(result => result.rows)
  },
  deleteUser(userId) {
    return client.query(`
      DELETE FROM users WHERE id=$1 RETURNING id
    `, [userId]).then(result => result.rows[0])
  },
  listResources() {
    return client.query(`
      SELECT * FROM resources
    `).then(result => result.rows)
  },
  listUserResources(userId) {
    return client.query(`
      SELECT * FROM resources WHERE owner=$1
    `, [userId]).then(result => result.rows)
  },
  deleteResource(resourceId) {
    return client.query(`
      DELETE FROM resources WHERE id=$1 RETURNING id
    `, [resourceId]).then(result => result.rows[0])
  },
  deleteUserResource(resourceId, userId) {
    return client.query(`
      DELETE FROM resources WHERE id=$1 AND owner=$2 RETURNING id
    `, [resourceId, userId]).then(result => result.rows[0])
  },
  createResource(name, owner) {
    return client.query(`
      INSERT INTO resources (name, owner) VALUES ($1, $2) RETURNING id
    `, [name, owner]).then(result => result.rows[0])
  },
  setQuota(userId, newQuota) {
    return client.query(`
      UPDATE users SET quota=$1 WHERE id=$2
    `, [newQuota, userId])
  }
}