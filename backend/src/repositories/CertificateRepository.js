const BaseRepository = require('./BaseRepository');

class CertificateRepository extends BaseRepository {
  async findAll(options = {}) {
    throw new Error('findAll() must be implemented');
  }

  async findPublished() {
    throw new Error('findPublished() must be implemented');
  }
}

module.exports = CertificateRepository;