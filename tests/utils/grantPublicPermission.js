const grantPublicPermission = async (controller) => {
  const publicRole = await strapi
    .query('role', 'users-permissions')
    .findOne({ type: 'public' });
  const permission = await strapi
    .query('permission', 'users-permissions')
    .findOne({ controller, role: publicRole.id });

  await strapi
    .query('permission', 'users-permissions')
    .update({ id: permission.id }, { enabled: true });
};

module.exports = grantPublicPermission;
