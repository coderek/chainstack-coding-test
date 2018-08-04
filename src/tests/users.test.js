/* global beforeAll, test, expect */
const axios = require('axios')
const resetDb = require('./reset-db')

const client = axios.create({
  baseURL: process.env.TEST_SERVER_URL || 'http://localhost:3001',
})

let token = null

beforeEach(async () => {
  await resetDb()
  await client.post('/auth', {
    email: 'admin@chainstack.com',
    password: 'abc',
  }).then(res => {
    token = res.data.token
  })
})

test('Test create/list/delete user', async () => {
  let newUserId=null
  await client.post('/users', {
    email: 'aa@dd.com',
    password: 'efs',
  }, {
    headers: {
      'Authorization': 'Bearer ' + token,
    },
  }).then(res => {
    expect(res.status).toBe(200)
    expect(res.data.id).toBeDefined()
    newUserId = res.data.id
  })

  await client.get('/users', {
    headers: {
      'Authorization': 'Bearer ' + token,
    },
  }).then(res => {
    expect(res.data.length).toBe(2)
    expect(res.data.map(u => u.email)).toContain('aa@dd.com')
  })

  await client.delete('/users/' + newUserId, {
    headers: {
      'Authorization': 'Bearer ' + token,
    },
  }).then(res => {
    expect(res.status).toBe(200)
  })


  await client.get('/users', {
    headers: {
      'Authorization': 'Bearer ' + token,
    },
  }).then(res => {
    expect(res.data.length).toBe(1)
    expect(res.data.map(u => u.email)).toContain('admin@chainstack.com')
  })

  await client.delete('/users/1').catch(error => {
    expect(error.response.status).toBe(401)
  })
})