const InMemoryBaseRepository = require('./InMemoryBaseRepository');
const ModuleRepository = require('../ModuleRepository');

class InMemoryModuleRepository extends InMemoryBaseRepository {
  constructor(initialData = []) {
    super(initialData);
  }

  async findByCourseId(courseId) {
    return this.findAll({ filter: { course_id: courseId }, orderBy: 'order_index', ascending: true });
  }
}

module.exports = InMemoryModuleRepository;