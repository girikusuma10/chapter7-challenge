const request = require("supertest")
const app = require("../app")
const config = require("./config")
const {UserCar}= require("./../app/models")

const result= {
  id: 0,
  deleteCarId: 0,
}

describe('Test cars path', ()=> {
  afterAll(()=> {
    UserCar.destroy({
      where: {},
      truncate: true
    })
  })

  it('should able to login with admin account', async ()=> {
    const resp= await request(app)
      .post('/v1/auth/login')
      .send({
        email: config.adminEmail,
        password: config.password
      })

    expect(resp.statusCode).toBe(201)
    config.adminToken= resp.body.accessToken
  })

  it('should able to login with customer account', async ()=> {
    const resp= await request(app)
      .post('/v1/auth/login')
      .send({
        email: config.customerEmail,
        password: config.password
      })

    expect(resp.statusCode).toBe(201)
    config.customerToken= resp.body.accessToken
  })

  it('should throw unauthorized when token is not provided', async ()=> {
    const resp= await request(app)
      .post('/v1/cars')

      expect(resp.statusCode).toBe(401)
  })

  it('should throw unauthorized when access token is not admin role for admin only endpoints', async ()=> {
    const resp= await request(app)
      .post('/v1/cars')
      .set('authorization', `Bearer ${config.customerToken}`)

      expect(resp.statusCode).toBe(401)
  })

  it('should able to show all cars', async ()=> {
    const resp= await request(app)
      .get('/v1/cars')

      expect(resp.statusCode).toBe(200)
      expect(resp.body).toHaveProperty('cars')
  })
  
  it('should able to show car detail', async ()=> {
    const resp= await request(app)
      .get('/v1/cars/1')

      expect(resp.statusCode).toBe(200)
  })

  it('should able to add new car', async ()=> {
    const resp= await request(app)
      .post('/v1/cars')
      .set('authorization', `Bearer ${config.adminToken}`)
      .send({
        name: "Test",
        price: 60000,
        image: null,
        size: "small"
      })

    const respToDelete= await request(app)
      .post('/v1/cars')
      .set('authorization', `Bearer ${config.adminToken}`)
      .send({
        name: "Test",
        price: 60000,
        image: null,
        size: "small"
      })

      expect(resp.statusCode).toBe(201)
      expect(respToDelete.statusCode).toBe(201)
      result.id= resp.body.id
      result.deleteCarId= respToDelete.body.id
  })

  it('should able to update car',  async ()=> {
    const resp= await request(app)
      .put(`/v1/cars/${result.id}`)
      .set('authorization', `Bearer ${config.adminToken}`)
      .send({
        name: "Test update",
        price: 61000,
        image: "update",
        size: "medium"
      })

      expect(resp.statusCode).toBe(200)
  })

  it('should able to delete car',  async ()=> {
    const resp= await request(app)
      .delete(`/v1/cars/${result.deleteCarId}`)
      .set('authorization', `Bearer ${config.adminToken}`)

      expect(resp.statusCode).toBe(204)

    const respDetail= await request(app)
      .get(`/v1/cars/${result.deleteCarId}`)

      expect(respDetail.body).toBeNull()
  })

  it('should able to rent car',  async ()=> {
    const resp= await request(app)
      .post(`/v1/cars/${result.id}/rent`)
      .set('authorization', `Bearer ${config.customerToken}`)
      .send({
        "rentStartedAt": new Date(),
        "rentEndedAt": new Date()
      })

      expect(resp.statusCode).toBe(201)
  })

  it('should not able to rent car if credential is not customer',  async ()=> {
    const resp= await request(app)
      .post(`/v1/cars/${result.id}/rent`)
      .set('authorization', `Bearer ${config.adminToken}`)
      .send({
        "rentStartedAt": new Date(),
        "rentEndedAt": new Date()
      })

      expect(resp.statusCode).toBe(401)
  })
})