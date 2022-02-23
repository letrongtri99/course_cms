const request = require('supertest');

const mockSub = {
  title: 'Test Sub',
  price: 12.0,
  currency: 'usd',
};

it('should return a subscription array', async () => {
  await request(strapi.server)
    .get('/subscriptions')
    .expect(200)
    .then((data) => {
      expect(
        data.body && typeof data.body === 'object' && data.body.length >= 0
      ).toBe(true);
    });
});

it('should return created subscription', async () => {
  await request(strapi.server)
    .post('/subscriptions')
    .send(mockSub)
    .expect(200)
    .then((data) => {
      expect(data.body && typeof data.body === 'object').toBe(true);
      expect(data.body.id && typeof data.body.id === 'number').toBe(true);
      expect(data.body.title && data.body.title === 'Test Sub').toBe(true);
      expect(data.body.price && data.body.price === 12.0).toBe(true);
      expect(data.body.currency && data.body.currency === 'usd').toBe(true);
    });
});

it('should return updated subscription', async () => {
  let initialSub = await strapi
    .query('subscriptions')
    .findOne({ title: 'Test Sub' }, {});

  if (!initialSub) {
    initialSub = await strapi.query('subscriptions').create(mockSub);
  }

  await request(strapi.server)
    .put('/subscriptions/' + initialSub.id)
    .send({
      title: 'Updated Sub',
    })
    .expect(200)
    .then((data) => {
      expect(data.body && typeof data.body === 'object').toBe(true);
      expect(data.body.id && typeof data.body.id === 'number').toBe(true);
      expect(data.body.title && data.body.title === 'Updated Sub').toBe(true);
    });
});

it('should return deleted sub', async () => {
  let initialSub = await strapi
    .query('subscriptions')
    .findOne({ title: 'Test Sub' }, {});

  if (!initialSub) {
    initialSub = await strapi.query('subscriptions').create(mockSub);
  }

  await request(strapi.server)
    .delete('/subscriptions/' + initialSub.id)
    .expect(200)
    .then((data) => {
      expect(data.body && typeof data.body === 'object').toBe(true);
      expect(data.body.id && typeof data.body.id === 'number').toBe(true);
      expect(data.body.title && data.body.title === 'Test Sub').toBe(true);
    });

  await request(strapi.server)
    .get('/subscriptions/' + initialSub.id)
    .expect(404);
});
