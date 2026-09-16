class BaseRepository {
  async findAll(options = {}) {
    throw new Error('findAll() must be implemented');
  }

  async findById(id) {
    throw new Error('findById() must be implemented');
  }

  async findOne(filter) {
    throw new Error('findOne() must be implemented');
  }

  async create(data) {
    throw new Error('create() must be implemented');
  }

  async update(id, data) {
    throw new Error('update() must be implemented');
  }

  async delete(id) {
    throw new Error('delete() must be implemented');
  }

  async count(filter = {}) {
    throw new Error('count() must be implemented');
  }
}

module.exports = BaseRepository;