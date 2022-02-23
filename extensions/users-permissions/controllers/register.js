module.exports = {
  /*
   * Create user with role author
   */
  register: async (ctx, next) => {
    const { username, email, password } = ctx.request.body;
    try {
      const hashPassword = await strapi.admin.services.auth.hashPassword(
        password
      );

      const roleAuthor = await strapi
        .query('role', 'admin')
        .findOne({ code: 'strapi-author' });

      const userPermission = await strapi.plugins[
        'users-permissions'
      ].services.user.add({
        username,
        email,
        password,
        provider: 'local', // register by api from front-end
        confirmed: true,
        blocked: false,
      });

      await strapi.query('user', 'admin').create({
        username,
        password: hashPassword,
        email,
        blocked: false,
        isActive: true,
        roles: [roleAuthor],
      });

      return ctx.send(
        {
          user: userPermission,
        },
        200
      );
    } catch (error) {
      return ctx.send(
        {
          user: null,
          error: error.message,
        },
        400
      );
    }
  },
};
