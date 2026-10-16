const assert = require('assert');
const express = require('express');
const { repositoryFactory } = require('../src/repositories');
const createLeadsRoutes = require('../src/routes/leads');

async function testLeadAccessCheck() {
  const previousAdminPassword = process.env.ADMIN_PASSWORD;
  process.env.ADMIN_PASSWORD = 'test-admin-password';

  const app = express();
  app.use(express.json());
  app.use('/api/leads', createLeadsRoutes({
    findByEmail: async (email) => email === 'member@example.com' ? { id: 'lead-1', email } : null,
  }));

  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    const unauthorized = await fetch(`${baseUrl}/api/leads/access-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'member@example.com' }),
    });
    assert.strictEqual(unauthorized.status, 401, 'Access check should require authentication');

    const invalidToken = await fetch(`${baseUrl}/api/leads/access-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer wrong-password',
      },
      body: JSON.stringify({ email: 'member@example.com' }),
    });
    assert.strictEqual(invalidToken.status, 403, 'Access check should reject invalid credentials');

    const missingEmail = await fetch(`${baseUrl}/api/leads/access-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-admin-password',
      },
      body: JSON.stringify({}),
    });
    assert.strictEqual(missingEmail.status, 400, 'Access check should reject a missing email');

    const memberResponse = await fetch(`${baseUrl}/api/leads/access-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-admin-password',
      },
      body: JSON.stringify({ email: 'member@example.com' }),
    });
    const memberResult = await memberResponse.json();
    assert.deepStrictEqual(memberResult, { hasAccess: true }, 'Access check should return only the access flag');

    const unknownResponse = await fetch(`${baseUrl}/api/leads/access-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-admin-password',
      },
      body: JSON.stringify({ email: 'unknown@example.com' }),
    });
    const unknownResult = await unknownResponse.json();
    assert.deepStrictEqual(unknownResult, { hasAccess: false }, 'Unknown email should not have access');
    console.log('✓ protected lead access check works');
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
    if (previousAdminPassword === undefined) {
      delete process.env.ADMIN_PASSWORD;
    } else {
      process.env.ADMIN_PASSWORD = previousAdminPassword;
    }
  }
}

async function runTests() {
  console.log('Initializing repositories in in-memory mode...');
  
  repositoryFactory.reset();
  repositoryFactory.initialize({
    useInMemory: true,
    initialData: {
      courses: [{ id: '1', title: 'Existing Course', slug: 'existing', is_published: true, order_index: 0, created_at: new Date().toISOString() }]
    }
  });
  
  const repos = repositoryFactory.getRepositories();
  const coursesRepo = repos.courses;

  // Test findAll
  let courses = await coursesRepo.findAll({ orderBy: 'order_index', ascending: true });
  assert.strictEqual(courses.length, 1, 'Should have 1 course');
  console.log('✓ findAll works');

  // Test findById
  let course = await coursesRepo.findById('1');
  assert.strictEqual(course.title, 'Existing Course', 'Should find course by ID');
  console.log('✓ findById works');

  // Test findBySlug
  course = await coursesRepo.findBySlug('existing');
  assert.strictEqual(course.slug, 'existing', 'Should find course by slug');
  console.log('✓ findBySlug works');

  // Test create
  const newCourse = await coursesRepo.create({
    title: 'New Course',
    slug: 'new-course',
    description: 'A new course',
    is_published: false,
    order_index: 1
  });
  assert.ok(newCourse.id, 'New course should have an ID');
  assert.strictEqual(newCourse.title, 'New Course');
  console.log('✓ create works');

  // Test update
  const updated = await coursesRepo.update(newCourse.id, { title: 'Updated Course' });
  assert.strictEqual(updated.title, 'Updated Course', 'Should update course');
  console.log('✓ update works');

  // Test delete
  await coursesRepo.delete(newCourse.id);
  const deleted = await coursesRepo.findById(newCourse.id);
  assert.strictEqual(deleted, null, 'Should not find deleted course');
  console.log('✓ delete works');

  // Test findPublished
  const published = await coursesRepo.findPublished();
  assert.strictEqual(published.length, 1, 'Should find 1 published course');
  console.log('✓ findPublished works');

  // Test in-memory reset
  coursesRepo.reset([]);
  courses = await coursesRepo.findAll();
  assert.strictEqual(courses.length, 0, 'Should have 0 courses after reset');
  console.log('✓ reset works');

  // Test modules
  const modulesRepo = repos.modules;
  await modulesRepo.create({ course_id: '1', title: 'Module 1', order_index: 0 });
  const modules = await modulesRepo.findByCourseId('1');
  assert.strictEqual(modules.length, 1, 'Should find 1 module for course');
  console.log('✓ modules repository works');

  // Test sorting with equal values
  coursesRepo.reset([
    { id: 'a', title: 'First', order_index: 0, created_at: '2024-01-01' },
    { id: 'b', title: 'Second', order_index: 0, created_at: '2024-01-01' },
    { id: 'c', title: 'Third', order_index: 0, created_at: '2024-01-01' },
  ]);
  const sorted = await coursesRepo.findAll({ orderBy: 'order_index', ascending: true });
  assert.strictEqual(sorted.length, 3, 'Should have 3 courses');
  // Ensure stable sort doesn't break with equal values
  assert.strictEqual(sorted[0].id, 'a', 'First item should remain first');
  assert.strictEqual(sorted[2].id, 'c', 'Last item should be last');
  console.log('✓ sorting with equal values works');

  // Test delete returns false for non-existent item
  const deleteResult = await coursesRepo.delete('non-existent-id');
  assert.strictEqual(deleteResult, false, 'Should return false for non-existent item');
  console.log('✓ delete returns false for non-existent item');

  // Test delete returns true for existing item
  const deleteResult2 = await coursesRepo.delete('a');
  assert.strictEqual(deleteResult2, true, 'Should return true for deleted item');
  console.log('✓ delete returns true for existing item');

  await testLeadAccessCheck();
  console.log('\n✅ All tests passed!');
  console.log('Repository abstraction and lead access checks are working correctly.');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});