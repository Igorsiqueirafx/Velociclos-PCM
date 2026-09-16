const BaseRepository = require('./BaseRepository');

class CourseRepository extends BaseRepository {
  async findAll(options = {}) {
    throw new Error('findAll() must be implemented');
  }

  async findPublished() {
    throw new Error('findPublished() must be implemented');
  }

  async findBySlug(slug) {
    throw new Error('findBySlug() must be implemented');
  }
}

module.exports = CourseRepository;