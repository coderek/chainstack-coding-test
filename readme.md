# Chainstack coding test


### Environment tested
MacOS with docker v18.06, docker-compose v1.22

### Running test
`./scripts/run-test.sh`

### Running server
`./scripts/run-test.sh`

### APIs available
1. `POST /auth` Login   
    Body format e.g.`{email: 'a@b.com', password: 'abc'}
2. `POST /resources` Create resource  
    Body format e.g. `{name: 'abc'}`
3. `GET /resources` List resource  
    Query params support `user_id` for admin user to list resources for specific user
4. `DELETE /resources/:id` Delete a resource
5. `POST /users` Create user (admin only)  
    Body format e.g. `{email: 'a@b.com', password: 'abc', role: 'normal', quota: 123}`
6. `GET /users` List users (admin only)
7. `DELETE /users/:id` Delete user (admin only)
8. `PUT /users/:id/quota` Update quota (admin only)  
    Body format e.g. `{quota: 123}`

### Authentication
After login successfully, you will get a token. Put the token in the `Authorization` header in the following format.

For eg. token = 123456  
`Authorization: Bearer 123455`  
Default expiry time is 2 hours later.


### Required header
1. `Accespt: application/json`
2. `Content-Type: application/json` for POST and PUT requests


### NOTE
1. Database is not persistent. It can be made persistent by add volume mapping to db services.
2. Default users are just one admin user `admin@chainstack.com/abc`
