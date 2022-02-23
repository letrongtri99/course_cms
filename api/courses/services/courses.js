'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

const { PAYMENT_STATUS } = require('#constant/payment');

const VALID_PAYMENT_STATUS = [PAYMENT_STATUS.PAID, PAYMENT_STATUS.TRIAL];

module.exports = {
  getUserCourses: async (user) => {
    try {
      const { groups, institutions } = await strapi.services.users.getUserGroup(
        user.id
      );

      const query = `
      SELECT c.*, sp.*
      FROM courses c
      INNER JOIN courses_subscriptions__subscriptions_courses cs
      ON cs.course_id = c.id AND c.published_at IS NOT NULL
      INNER JOIN (SELECT subscription, startDate, MAX(endDate) endDate
      FROM sub_payments
      WHERE (\`user\` = ${user.id}
      ${
        groups.length
          ? `OR \`group\` IN (${groups.map((g) => g.id).join(', ')})`
          : ''
      }
      ${
        institutions.length
          ? `OR \`institution\` IN (${groups
              .map((g) => g.institution.id)
              .join(', ')})`
          : ''
      })
      AND \`status\` IN ('${VALID_PAYMENT_STATUS.join("', '")}')
      GROUP BY subscription) sp
      ON sp.subscription = cs.subscription_id`;

      const courses = await strapi.connections.default.raw(query);

      return courses[0];
    } catch (error) {
      throw new Error(error);
    }
  },

  getUserCourse: async (user, courseId) => {
    try {
      const { groups, institutions } = await strapi.services.users.getUserGroup(
        user.id
      );

      const query = `
      SELECT c.*, sp.subscription, sp.startDate, sp.endDate
      FROM courses c
      INNER JOIN courses_subscriptions__subscriptions_courses cs
      ON cs.course_id = c.id AND c.id = ${courseId} AND c.published_at IS NOT NULL
      INNER JOIN sub_payments sp
      ON sp.subscription = cs.subscription_id AND (sp.\`user\` = ${user.id} ${
        groups.length
          ? `OR sp.\`group\` IN (${groups.map((g) => g.id).join(', ')})`
          : ''
      }
      ${
        institutions.length
          ? `OR sp.\`institution\` IN (${groups
              .map((g) => g.institution.id)
              .join(', ')})`
          : ''
      })
      ORDER BY endDate DESC
      LIMIT 1`;

      const course = await strapi.connections.default.raw(query);

      return course[0];
    } catch (error) {
      throw new Error(error);
    }
  },
};
