/* global beforeEach, test, expect */
const axios = require('axios')
const resetDb = require('./reset-db')

console.log(process.env.SERVER_URL)
const client = axios.create({
  baseURL: process.env.SERVER_URL || 'http://localhost:3001'
})

beforeEach(() => {
  return resetDb()
})

test('Test authentication', async () => {
  await client.post('/auth', {
    email: 'admin@chainstack.com',
    password: 'abc'
  }).then(res => {
    expect(res.status).toBe(200)
    expect(res.data.message).toContain('success')
  })

  await client.post('/auth', {
    email: 'ss@chain.com',
    password: 'abc'
  }).then(res => {
    expect(res.status).toBe(200)
    expect(res.data.message).toContain('wrong')
  })

})
