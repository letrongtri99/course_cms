'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  getUserGroup: async (userId) => {
    try {
      const groups = await strapi
        .query('groups')
        .find({ users_in: [userId], published_at_null: false });

      const institutions = groups.map((g) => g.institution.id);

      return {
        groups,
        institutions,
      };
    } catch (error) {
      throw new Error(error);
    }
  },
};
