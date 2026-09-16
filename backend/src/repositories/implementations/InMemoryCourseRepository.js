const InMemoryBaseRepository = require('./InMemoryBaseRepository');
const CourseRepository = require('../CourseRepository');

class InMemoryCourseRepository extends InMemoryBaseRepository {
  constructor(initialData = []) {
    super(initialData);
  }

  async findPublished() {
    return this.findAll({ filter: { is_published: true }, orderBy: 'order_index', ascending: true });
  }

  async findBySlug(slug) {
    return this.findOne({ slug });
  }
}

module.exports = InMemoryCourseRepository;