const VercelKVBaseRepository = require('./VercelKVBaseRepository');
const PageRepository = require('../PageRepository');

class VercelKVPageRepository extends VercelKVBaseRepository {
  constructor() {
    super('pages');
  }

  async findPublished() {
    return this.findAll({ filter: { is_published: true }, orderBy: 'sort_order', ascending: true });
  }

  async findBySlug(slug) {
    return this.findOne({ slug });
  }
}

module.exports = VercelKVPageRepository;