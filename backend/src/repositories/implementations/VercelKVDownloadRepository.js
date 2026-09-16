const VercelKVBaseRepository = require('./VercelKVBaseRepository');
const DownloadRepository = require('../DownloadRepository');

class VercelKVDownloadRepository extends VercelKVBaseRepository {
  constructor() {
    super('downloads');
  }

  async findPublished() {
    return this.findAll({ filter: { is_published: true }, orderBy: 'created_at', ascending: false });
  }
}

module.exports = VercelKVDownloadRepository;