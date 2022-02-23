const request = require('supertest');
const grantPublicPermission = require('../utils/grantPublicPermission');

const mockRegister = {
  username: 'testname',
  email: 'testgmail.com',
  password: 'Test1234',
};

it('should return registed user', async () => {
  await grantPublicPermission('register');

  await request(strapi.server)
    .post('/users-permissions/register')
    .send(mockRegister)
    .expect(200)
    .then((data) => {
      expect(data.body.user && typeof data.body.user === 'object').toBe(true);
      expect(data.body.user.id && typeof data.body.user.id === 'number').toBe(
        true
      );
      expect(
        data.body.user.email && typeof data.body.user.email === 'string'
      ).toBe(true);
    });
});
