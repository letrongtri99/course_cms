const strapiHelper = require('strapi');
const http = require('http');
const Promise = require('promise');

let instance;

async function setupStrapi() {
  if (!instance) {
    await strapiHelper().load();
    instance = strapi;
    await instance.app
      .use(instance.router.routes())
      .use(instance.router.allowedMethods());

    instance.server = http.createServer(instance.app.callback());

    const publicRole = await strapi
      .query('role', 'users-permissions')
      .findOne({ type: 'public' });
    const permissions = await strapi
      .query('permission', 'users-permissions')
      .find({ type: 'application', role: publicRole.id });
    await Promise.all(
      permissions.map((p) =>
        strapi
          .query('permission', 'users-permissions')
          .update({ id: p.id }, { enabled: true })
      )
    );
  }
  return instance;
}
module.exports = { setupStrapi };
