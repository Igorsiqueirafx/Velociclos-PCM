const BaseRepository = require('./BaseRepository');

class LessonRepository extends BaseRepository {
  async findAll(options = {}) {
    throw new Error('findAll() must be implemented');
  }

  async findByModuleId(moduleId) {
    throw new Error('findByModuleId() must be implemented');
  }

  async findByCourseId(courseId) {
    throw new Error('findByCourseId() must be implemented');
  }

  async findPublished() {
    throw new Error('findPublished() must be implemented');
  }
}

module.exports = LessonRepository;