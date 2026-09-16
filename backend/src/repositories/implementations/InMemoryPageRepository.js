const InMemoryBaseRepository = require('./InMemoryBaseRepository');
const PageRepository = require('../PageRepository');

class InMemoryPageRepository extends InMemoryBaseRepository {
  constructor(initialData = []) {
    super(initialData);
  }

  async findPublished() {
    return this.findAll({ filter: { is_published: true }, orderBy: 'sort_order', ascending: true });
  }

  async findBySlug(slug) {
    return this.findOne({ slug });
  }
}

module.exports = InMemoryPageRepository;