/* global beforeAll, test, expect, describe, it */
const axios = require('axios')
const resetDb = require('./reset-db')

const client = axios.create({
  baseURL: process.env.SERVER_URL || 'http://localhost:3001',
})

let adminToken = null
let token1 = null
let token2 = null

describe('Resources', async () => {

  beforeAll(async () => {
    await resetDb()

    await client.post('/auth', {
      email: 'admin@chainstack.com',
      password: 'abc',
    }).then(res => {
      adminToken = res.data.token
      client.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
    })

    await client.post('/users', {
      email: 'user1@chainstack.com',
      password: 'abc',
      quota: 1,
      role: 'normal',
    })

    await client.post('/users', {
      email: 'user2@chainstack.com',
      password: 'abc',
      quota: 1,
      role: 'normal',
    })
    // login as user1
    await client.post('/auth', {
      email: 'user1@chainstack.com',
      password: 'abc',
    }).then(res => {
      token1 = res.data.token
    })
    // login as user2
    await client.post('/auth', {
      email: 'user2@chainstack.com',
      password: 'abc',
    }).then(res => {
      token2 = res.data.token
    })
  })

  describe('user create resource', async () => {
    it('should be successful', async () => {
      // user1 create resource
      await client.post('/resources', {
        name: 'test-resource1',
      }, {
        headers: {
          'Authorization': `Bearer ${token1}`,
        },
      }).then(res => {
        expect(res.status).toBe(200)
      })

      // user2 create resource
      await client.post('/resources', {
        name: 'test-resource2',
      }, {
        headers: {
          'Authorization': `Bearer ${token2}`,
        },
      }).then(res => {
        expect(res.status).toBe(200)
      })

    })
  })

  let resource1ID = null
  let resource2ID = null

  describe('user access his own resources', async () => {
    it('should not show others', async () => {
      // user1 should see his own only
      await client.get('/resources', {
        headers: {'Authorization': `Bearer ${token1}`},
      }).then(res => {
        expect(res.data.length).toBe(1)
        expect(res.data[0].name).toBe('test-resource1')
        resource1ID = res.data[0].id
      })

      // user1 should see his own only
      await client.get('/resources', {
        headers: {'Authorization': `Bearer ${token2}`},
      }).then(res => {
        expect(res.data.length).toBe(1)
        expect(res.data[0].name).toBe('test-resource2')
        resource2ID = res.data[0].id
      })
    })
  })

  describe('admin should see all', async () => {
    it('should list all for admin', async () => {
      await client.get('/resources', {
        headers: {'Authorization': `Bearer ${adminToken}`},
      }).then(res => {
        expect(res.data.length).toBe(2)
      })
    })
  })

  describe('delete resource', async () => {
    it('should allow admin to delete', async () => {
      await client.delete('/resources/' + resource1ID, {
        headers: {'Authorization': `Bearer ${adminToken}`},
      }).then(res => {
        expect(res.status).toBe(200)
      })
    })

    it('should not allow user1 to delete resource2', async () => {
      await client.delete('/resources/' + resource2ID, {
        headers: {'Authorization': `Bearer ${token1}`},
      }).catch(error => {
        expect(error.response.status).toBe(404)
      })
    })
  })

  describe('quota', async () => {
    it('should decrement quota for both users', async () => {
      await client.get('/users', {
        headers: {'Authorization': `Bearer ${adminToken}`},
      }).then(({data}) => {
        expect(data.length).toBe(3)
        expect(data.map(d => d.quota)).toEqual([-1, 0, 0])
      })
    })

    it('should not allow user to create resource', async () => {
      await client.post('/resources', {
        name: 'test-resource1',
      }, {
        headers: {
          'Authorization': `Bearer ${token1}`,
        },
      }).catch( ({response: {status}})=> {
        expect(status).toBe(429)
      })
      await client.post('/resources', {
        name: 'test-resource1',
      }, {
        headers: {
          'Authorization': `Bearer ${token2}`,
        },
      }).catch( ({response: {status}})=> {
        expect(status).toBe(429)
      })
    })
  })
})
