const BaseRepository = require('./BaseRepository');

class ModuleRepository extends BaseRepository {
  async findAll(options = {}) {
    throw new Error('findAll() must be implemented');
  }

  async findByCourseId(courseId) {
    throw new Error('findByCourseId() must be implemented');
  }
}

module.exports = ModuleRepository;