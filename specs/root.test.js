const request = require("supertest");
const app = require("../app/index");

describe('Test root path', () => { 
  test('should response when request to /', async () => { 
    const resp= await request(app).get('/')
    
    expect(resp.statusCode).toBe(200)
    expect(resp.body.status).toBe('OK')
  })
 })