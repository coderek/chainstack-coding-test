const {Client} = require('pg')
const config = require('../config.json')
const fs = require('fs')
const path = require('path')

const client = new Client({
  ...config.database.test
})

client.connect()

function reset () {
  const schema = fs.readFileSync(path.resolve(__dirname, '../db/schema.sql'), 'utf8')
  const bootstrap = fs.readFileSync(path.resolve(__dirname, '../db/bootstrap.sql'), 'utf8')

  client.query(schema + '\n' + bootstrap).then(() => {
    client.end()
  })
}

module.exports = reset