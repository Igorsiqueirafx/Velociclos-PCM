const VercelKVBaseRepository = require('./VercelKVBaseRepository');
const CourseRepository = require('../CourseRepository');

class VercelKVCourseRepository extends VercelKVBaseRepository {
  constructor() {
    super('courses');
  }

  async findPublished() {
    return this.findAll({ filter: { is_published: true }, orderBy: 'order_index', ascending: true });
  }

  async findBySlug(slug) {
    return this.findOne({ slug });
  }
}

module.exports = VercelKVCourseRepository;