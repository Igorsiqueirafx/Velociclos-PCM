const InMemoryBaseRepository = require('./InMemoryBaseRepository');
const DownloadRepository = require('../DownloadRepository');

class InMemoryDownloadRepository extends InMemoryBaseRepository {
  constructor(initialData = []) {
    super(initialData);
  }

  async findPublished() {
    return this.findAll({ filter: { is_published: true }, orderBy: 'created_at', ascending: false });
  }
}

module.exports = InMemoryDownloadRepository;