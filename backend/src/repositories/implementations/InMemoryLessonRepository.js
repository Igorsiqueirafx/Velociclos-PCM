const InMemoryBaseRepository = require('./InMemoryBaseRepository');
const LessonRepository = require('../LessonRepository');

class InMemoryLessonRepository extends InMemoryBaseRepository {
  constructor(initialData = []) {
    super(initialData);
  }

  async findByModuleId(moduleId) {
    return this.findAll({ filter: { module_id: moduleId }, orderBy: 'order_index', ascending: true });
  }

  async findByCourseId(courseId) {
    return this.findAll({ filter: { course_id: courseId }, orderBy: 'order_index', ascending: true });
  }

  async findPublished() {
    return this.findAll({ filter: { is_published: true }, orderBy: 'order_index', ascending: true });
  }
}

module.exports = InMemoryLessonRepository;