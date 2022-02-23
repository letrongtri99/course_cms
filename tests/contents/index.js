const request = require('supertest');

it('should return content array', async () => {
  await request(strapi.server)
    .get('/contents')
    .expect(200)
    .then((data) => {
      expect(
        data.body && typeof data.body === 'object' && data.body.length >= 0
      ).toBe(true);
    });
});
