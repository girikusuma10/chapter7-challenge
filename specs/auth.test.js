const request= require('supertest')
const app= require('../app/index')
const config = require('./config');

describe('Test auth path', () => {
  it('should register new account when provided with credential', async () => {
    const resp= await request(app)
      .post('/v1/auth/register')
      .send({
        name: config.customerName,
        email: config.registerEmail,
        password: config.password
      })

    expect(resp.statusCode).toBe(201)
  });

  it('should response error when account is already registered', async () => {
    const resp= await request(app)
      .post('/v1/auth/register')
      .send({
        name: config.customerName,
        email: config.customerEmail,
        password: config.password
      })
  
    expect(resp.statusCode).toBe(500)
  })

  it('should login when provided with registered credential', async () => {
    const resp= await request(app)
      .post('/v1/auth/login')
      .send({
        email: config.customerEmail,
        password: config.password
      })

    expect(resp.statusCode).toBe(201)
    config.customerToken= resp.body.accessToken
  });
  
  it('should throw error when body is invalid when login', async () => {
    const resp= await request(app)
      .post('/v1/auth/login')
      .send({
        email: config.customerEmail,
        passwords: config.password
      })
  
    expect(resp.statusCode).toBe(500)
  })

  it('should return user data when provided with token ', async ()=> {
    const resp= await request(app)
      .get('/v1/auth/whoami')
      .set('authorization', `Bearer ${config.customerToken}`)

      expect(resp.statusCode).toBe(200)
  })

  it('should not return user data when token is not present', async ()=> {
    const resp= await request(app)
      .get('/v1/auth/whoami')

      expect(resp.statusCode).toBe(401)
  })
});