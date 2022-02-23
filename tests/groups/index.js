const request = require('supertest');

const mockGroup = {
  name: 'Test Group',
  location: 'Test Location',
};

it('should return group array', async () => {
  await request(strapi.server)
    .get('/groups')
    .expect(200)
    .then((data) => {
      expect(
        data.body && typeof data.body === 'object' && data.body.length >= 0
      ).toBe(true);
    });
});

it('should return created group', async () => {
  await request(strapi.server)
    .post('/groups')
    .send(mockGroup)
    .expect(200)
    .then((data) => {
      expect(data.body && typeof data.body === 'object').toBe(true);
      expect(data.body.id && typeof data.body.id === 'number').toBe(true);
      expect(data.body.name && data.body.name === 'Test Group').toBe(true);
      expect(data.body.location && data.body.location === 'Test Location').toBe(
        true
      );
    });
});

it('should return updated group', async () => {
  let initialGroup = await strapi
    .query('groups')
    .findOne({ name: 'Test Group' }, {});

  if (!initialGroup) {
    initialGroup = await strapi.query('groups').create(mockGroup);
  }

  await request(strapi.server)
    .put('/groups/' + initialGroup.id)
    .send({
      name: 'Updated Group',
    })
    .expect(200)
    .then((data) => {
      expect(data.body && typeof data.body === 'object').toBe(true);
      expect(data.body.id && typeof data.body.id === 'number').toBe(true);
      expect(data.body.name && data.body.name === 'Updated Group').toBe(true);
    });
});

it('should return deleted group', async () => {
  let initialGroup = await strapi
    .query('groups')
    .findOne({ name: 'Test Group' }, {});

  if (!initialGroup) {
    initialGroup = await strapi.query('groups').create(mockGroup);
  }

  await request(strapi.server)
    .delete('/groups/' + initialGroup.id)
    .expect(200)
    .then((data) => {
      expect(data.body && typeof data.body === 'object').toBe(true);
      expect(data.body.id && typeof data.body.id === 'number').toBe(true);
      expect(data.body.name && data.body.name === 'Test Group').toBe(true);
    });

  await request(strapi.server)
    .get('/groups/' + initialGroup.id)
    .expect(404);
});
