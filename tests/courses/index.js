const request = require('supertest');

const mockCourse = {
  title: 'Test',
  price: 199.99,
  start: '2022-01-01',
  end: '2022-12-31',
};

const mockUser = {
  username: 'testCourseName',
  email: 'testCoursegmail.com',
  password: 'Test1234',
  provider: 'local',
  confirmed: true,
  blocked: false,
};

const mockSub = {
  title: 'Test SubCourse',
  price: 12.0,
  currency: 'usd',
};

it('should return course array', async () => {
  await request(strapi.server)
    .get('/courses')
    .expect(200)
    .then((data) => {
      expect(
        data.body && typeof data.body === 'object' && data.body.length >= 0
      ).toBe(true);
    });
});

it('should return created course', async () => {
  await request(strapi.server)
    .post('/courses')
    .send(mockCourse)
    .expect(200)
    .then((data) => {
      expect(data.body && typeof data.body === 'object').toBe(true);
      expect(data.body.id && typeof data.body.id === 'number').toBe(true);
      expect(data.body.title && data.body.title === 'Test').toBe(true);
      expect(data.body.price && data.body.price === 199.99).toBe(true);
      expect(data.body.start && data.body.start === '2022-01-01').toBe(true);
      expect(data.body.end && data.body.end === '2022-12-31').toBe(true);
    });
});

it('should return updated course', async () => {
  let initialCourse = await strapi
    .query('courses')
    .findOne({ title: 'Test' }, {});

  if (!initialCourse) {
    initialCourse = await strapi.query('courses').create(mockCourse);
  }

  await request(strapi.server)
    .put('/courses/' + initialCourse.id)
    .send({
      title: 'Updated',
    })
    .expect(200)
    .then((data) => {
      expect(data.body && typeof data.body === 'object').toBe(true);
      expect(data.body.id && typeof data.body.id === 'number').toBe(true);
      expect(data.body.title && data.body.title === 'Updated').toBe(true);
    });
});

it('should return deleted course', async () => {
  let initialCourse = await strapi
    .query('courses')
    .findOne({ title: 'Test' }, {});

  if (!initialCourse) {
    initialCourse = await strapi.query('courses').create(mockCourse);
  }

  await request(strapi.server)
    .delete('/courses/' + initialCourse.id)
    .expect(200)
    .then((data) => {
      expect(data.body && typeof data.body === 'object').toBe(true);
      expect(data.body.id && typeof data.body.id === 'number').toBe(true);
      expect(data.body.title && data.body.title === 'Test').toBe(true);
    });

  await request(strapi.server)
    .get('/courses/' + initialCourse.id)
    .expect(404);
});

it("should return user's courses array", async () => {
  const user = await strapi.query('user', 'users-permissions').create(mockUser);
  const sub = await strapi.query('subscriptions').create(mockSub);
  await strapi.query('courses').create({
    ...mockCourse,
    subscriptions: [sub.id],
  });
  await strapi.query('sub-payment').create({
    user: user.id,
    subscription: sub.id,
    status: 'paid',
  });

  await strapi.services.courses.getUserCourses(user).then((data) => {
    expect(data && typeof data === 'object').toBe(true);
  });
});

it("should return user's course", async () => {
  const user = await strapi
    .query('user', 'users-permissions')
    .findOne({ username: mockUser.username });
  const course = await strapi
    .query('courses')
    .findOne({ title: mockCourse.title });
  await strapi.services.courses.getUserCourse(user, course.id).then((data) => {
    expect(data && typeof data === 'object').toBe(true);
  });
});
