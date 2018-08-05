const {Client} = require('pg')
const moment = require('moment')
const bcrypt = require('bcrypt')
const config = require('../config')

let _client = null

// Lazy load client
function getClient () {
  if (_client) 
    return _client
  
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
  _client = client
  return client
}

module.exports = {
  getUserBy(condition) {
    const keys = Object.keys(condition)
    return getClient().query(`
      SELECT * FROM users WHERE ${keys.map((k, i) => k + '=$' + (i + 1)).join(' ')}
    `, keys.map(k => condition[k])).then(result => result.rows[0])
  },
  getUserBySession(sessionId) {
    return getClient().query(`
      SELECT * FROM sessions s LEFT JOIN users u ON s.user_id = u.id WHERE s.session_id = $1
    `, [sessionId]).then(result => result.rows[0])
  },
  createSession(sessionId, userId) {
    //TODO move expiry duration to config
    return getClient().query(
      'INSERT INTO sessions (session_id, user_id, expires_at) VALUES ($1, $2, $3)',
      [sessionId, userId, moment().add(2, 'hours').toDate()])
  },
  createUser(email, password) {
    return getClient().query(`
      INSERT INTO users (email, password_hash) VALUES
      ($1, $2) RETURNING id
    `, [email, bcrypt.hashSync(password, 10)]).then(result => result.rows[0])
  },
  listUsers() {
    return getClient().query(`
      SELECT * FROM users
    `).then(result => result.rows)
  },
  deleteUser(userId) {
    return getClient().query(`
      DELETE FROM users WHERE id=$1 RETURNING id
    `, [userId]).then(result => result.rows[0])
  },
  listResources() {
    return getClient().query(`
      SELECT * FROM resources
    `).then(result => result.rows)
  },
  listUserResources(userId) {
    return getClient().query(`
      SELECT * FROM resources WHERE owner=$1
    `, [userId]).then(result => result.rows)
  },
  deleteResource(resourceId) {
    return getClient().query(`
      DELETE FROM resources WHERE id=$1 RETURNING id
    `, [resourceId]).then(result => result.rows[0])
  },
  deleteUserResource(resourceId, userId) {
    return getClient().query(`
      DELETE FROM resources WHERE id=$1 AND owner=$2 RETURNING id
    `, [resourceId, userId]).then(result => result.rows[0])
  },
  createResource(name, owner) {
    return getClient().query(`
      INSERT INTO resources (name, owner) VALUES ($1, $2) RETURNING id
    `, [name, owner]).then(result => result.rows[0])
  },
  setQuota(userId, newQuota) {
    return getClient().query(`
      UPDATE users SET quota=$1 WHERE id=$2
    `, [newQuota, userId])
  },
}