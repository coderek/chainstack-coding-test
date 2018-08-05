const {Client} = require('pg')
const config = require('../src/config')
const fs = require('fs')
const path = require('path')

function reset () {
  const client = new Client(config.database.main)
  client.on('error', err=> console.error(err))
  client.connect()

  const schema = fs.readFileSync(path.resolve(__dirname, '../src/db/schema.sql'), 'utf8')
  const bootstrap = fs.readFileSync(path.resolve(__dirname, '../src/db/bootstrap.sql'), 'utf8')

  client.query(schema + '\n' + bootstrap).then(() => {
    client.end()
  }).catch(() => {
    client.end()
  })
}

module.exports = reset