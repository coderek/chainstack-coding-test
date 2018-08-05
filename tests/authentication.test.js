/* global beforeAll, it, expect, describe */
const axios = require('axios')
const resetDb = require('./reset-db')

const client = axios.create({
  baseURL: process.env.SERVER_URL || 'http://localhost:3001',
})

describe('Authentication', async () => {
  beforeAll(async () => {
    await resetDb()
  })
  it('should authenticate correctly', async () => {

    await client.post('/auth', {
      email: 'admin@chainstack.com',
      password: 'abc',
    }).then(res => {
      expect(res.status).toBe(200)
      expect(res.data.message).toContain('success')
    })

    await client.post('/auth', {
      email: 'ss@chain.com',
      password: 'abc',
    }).then(res => {
      expect(res.status).toBe(200)
      expect(res.data.message).toContain('wrong')
    })
  })

})
