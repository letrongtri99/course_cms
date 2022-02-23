const request = require('supertest');

const tag = {
  title: 'Strapi',
};

it('should return tag array', async () => {
  await request(strapi.server)
    .get('/tags')
    .expect(200)
    .then((data) => {
      expect(
        data.body && typeof data.body === 'object' && data.body.length >= 0
      ).toBe(true);
    });
});

it('should return created tag object', async () => {
  await request(strapi.server)
    .post('/tags')
    .send(tag)
    .expect(200)
    .then((data) => {
      expect(data.body && typeof data.body === 'object').toBe(true);
      expect(data.body.id && typeof data.body.id === 'number').toBe(true);
      expect(data.body.title && data.body.title === 'Strapi').toBe(true);
    });
});

it('should return updated tag object', async () => {
  let oldTag = await strapi.query('tags').findOne({ title: 'Strapi' }, {});

  if (!oldTag) {
    oldTag = await strapi.query('tags').create(tag);
  }

  await request(strapi.server)
    .put('/tags/' + oldTag.id)
    .send({
      title: 'JS',
    })
    .expect(200)
    .then((data) => {
      expect(data.body && typeof data.body === 'object').toBe(true);
      expect(data.body.id && typeof data.body.id === 'number').toBe(true);
      expect(data.body.title && data.body.title === 'JS').toBe(true);
    });
});

it('should return deleted tag', async () => {
  let oldTag = await strapi.query('tags').findOne({ title: 'Strapi' }, {});

  if (!oldTag) {
    oldTag = await strapi.query('tags').create(tag);
  }

  await request(strapi.server)
    .delete('/tags/' + oldTag.id)
    .expect(200)
    .then((data) => {
      expect(data.body && typeof data.body === 'object').toBe(true);
      expect(data.body.id && typeof data.body.id === 'number').toBe(true);
      expect(data.body.title && data.body.title === 'Strapi').toBe(true);
    });

  await request(strapi.server)
    .get('/tags/' + oldTag.id)
    .expect(404);
});
