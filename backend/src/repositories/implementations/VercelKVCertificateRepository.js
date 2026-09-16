const VercelKVBaseRepository = require('./VercelKVBaseRepository');
const CertificateRepository = require('../CertificateRepository');

class VercelKVCertificateRepository extends VercelKVBaseRepository {
  constructor() {
    super('certificates');
  }

  async findPublished() {
    return this.findAll({ filter: { is_published: true }, orderBy: 'order_index', ascending: true });
  }
}

module.exports = VercelKVCertificateRepository;