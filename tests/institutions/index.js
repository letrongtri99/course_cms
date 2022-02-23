const request = require('supertest');

const mockIns = {
  name: 'Test Institution',
  location: 'Test location',
  type: 'school',
};

it('should return institution array', async () => {
  await request(strapi.server)
    .get('/institutions')
    .expect(200)
    .then((data) => {
      expect(
        data.body && typeof data.body === 'object' && data.body.length >= 0
      ).toBe(true);
    });
});

it('should return created institution', async () => {
  await request(strapi.server)
    .post('/institutions')
    .send(mockIns)
    .expect(200)
    .then((data) => {
      expect(data.body && typeof data.body === 'object').toBe(true);
      expect(data.body.id && typeof data.body.id === 'number').toBe(true);
      expect(data.body.name && data.body.name === 'Test Institution').toBe(
        true
      );
      expect(data.body.location && data.body.location === 'Test location').toBe(
        true
      );
    });
});

it('should return updated institution', async () => {
  let initialGroup = await strapi
    .query('institutions')
    .findOne({ name: 'Test Institution' }, {});

  if (!initialGroup) {
    initialGroup = await strapi.query('institution').create(mockIns);
  }

  await request(strapi.server)
    .put('/institutions/' + initialGroup.id)
    .send({
      name: 'Updated Institution',
    })
    .expect(200)
    .then((data) => {
      expect(data.body && typeof data.body === 'object').toBe(true);
      expect(data.body.id && typeof data.body.id === 'number').toBe(true);
      expect(data.body.name && data.body.name === 'Updated Institution').toBe(
        true
      );
    });
});

it('should return deleted institution', async () => {
  let initialGroup = await strapi
    .query('institutions')
    .findOne({ name: 'Test Institution' }, {});

  if (!initialGroup) {
    initialGroup = await strapi.query('institutions').create(mockIns);
  }

  await request(strapi.server)
    .delete('/institutions/' + initialGroup.id)
    .expect(200)
    .then((data) => {
      expect(data.body && typeof data.body === 'object').toBe(true);
      expect(data.body.id && typeof data.body.id === 'number').toBe(true);
      expect(data.body.name && data.body.name === 'Test Institution').toBe(
        true
      );
    });

  await request(strapi.server)
    .get('/institutions/' + initialGroup.id)
    .expect(404);
});
