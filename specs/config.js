const {nanoid}= require('nanoid');

const accountId= nanoid(7)
const mail= '@binar.co.id'

module.exports= {
  adminEmail: `admin${mail}`,
  customerEmail: `fikri${mail}`,
  customerName: accountId,
  registerEmail: `${accountId}${mail}`,
  password: '123456',
  adminToken: '',
  customerToken: '',
}