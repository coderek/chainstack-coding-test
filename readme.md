# Chainstack coding test

### Running test
`./scripts/run-test.sh`

### Running server
`./scripts/run-test.sh`

### APIs available
1. `POST /auth` Login
2. `POST /resources` Create resource
3. `GET /resources` List resource
4. `DELETE /resources/:id` Delete a resource
5. `POST /users` Create user (admin only)
6. `GET /users` List users (admin only)
7. `DELETE /users/:id` Delete user (admin only)
8. `PUT /users/:id/quota` Update quota (admin only)

### Authentication
After login successfully, you will get a token. Put the token in the `Authorization` header in the following format.

For eg. token = 123456  
`Authorization: Bearer 123455`  
Default expiry time is 2 hours later.


### Required header
1. `Accespt: application/json`
2. `Content-Type: application/json` for POST and PUT requests