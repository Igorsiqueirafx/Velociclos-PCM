const assert = require('assert');
const { repositoryFactory } = require('../src/repositories');

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

  console.log('\n✅ All tests passed!');
  console.log('Repository abstraction is working correctly.');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});