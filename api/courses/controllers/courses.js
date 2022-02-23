'use strict';

module.exports = {
  /*
   * Get user's course list
   */
  myCourse: async (ctx, next) => {
    const { user } = ctx.state;

    try {
      const courses = await strapi.services.courses.getUserCourses(user);

      return ctx.send(courses, 200);
    } catch (error) {
      return ctx.send(
        {
          error: error.message,
        },
        400
      );
    }
  },

  /*
   * Check if the user has bought the course
   */
  checkUserCourse: async (ctx, next) => {
    const { user } = ctx.state;
    const { id } = ctx.params;
    try {
      const course = await strapi.services.courses.getUserCourse(user, id);

      return ctx.send(course[0], 200);
    } catch (error) {
      return ctx.send(
        {
          error: error.message,
        },
        400
      );
    }
  },
};
