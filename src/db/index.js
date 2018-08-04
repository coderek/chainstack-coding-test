const {Client} = require('pg')

const client = new Client({
  user: 'cs',
  host: '0.0.0.0',
  database: 'chainstack',
  password: 'abc',
  port: 5434,
})
client.connect()

client.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  client.end()
})