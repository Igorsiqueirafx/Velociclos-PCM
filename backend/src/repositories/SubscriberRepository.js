const BaseRepository = require('./BaseRepository');

class SubscriberRepository extends BaseRepository {
  async findAll(options = {}) {
    throw new Error('findAll() must be implemented');
  }

  async findByEmail(email) {
    throw new Error('findByEmail() must be implemented');
  }
}

module.exports = SubscriberRepository;