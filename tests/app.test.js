const fs = require('fs');
const { setupStrapi } = require('./helpers/strapi');
require('.');

beforeAll(async () => {
  await setupStrapi();
});

afterAll(async () => {
  const dbSettings = strapi.config.get('database.connections.default.settings');
  await strapi.destroy();

  if (dbSettings && dbSettings.filename) {
    const tmpDbFile = `${__dirname}/../${dbSettings.filename}`;
    if (fs.existsSync(tmpDbFile)) {
      fs.unlinkSync(tmpDbFile);
    }
  }
});

it('strapi is defined', () => {
  expect(strapi).toBeDefined();
});
