const VercelKVBaseRepository = require('./VercelKVBaseRepository');
const ModuleRepository = require('../ModuleRepository');

class VercelKVModuleRepository extends VercelKVBaseRepository {
  constructor() {
    super('modules');
  }

  async findByCourseId(courseId) {
    return this.findAll({ filter: { course_id: courseId }, orderBy: 'order_index', ascending: true });
  }
}

module.exports = VercelKVModuleRepository;