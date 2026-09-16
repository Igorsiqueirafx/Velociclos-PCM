const InMemoryBaseRepository = require('./InMemoryBaseRepository');
const CertificateRepository = require('../CertificateRepository');

class InMemoryCertificateRepository extends InMemoryBaseRepository {
  constructor(initialData = []) {
    super(initialData);
  }

  async findPublished() {
    return this.findAll({ filter: { is_published: true }, orderBy: 'order_index', ascending: true });
  }
}

module.exports = InMemoryCertificateRepository;