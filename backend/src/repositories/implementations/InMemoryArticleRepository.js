const InMemoryBaseRepository = require('./InMemoryBaseRepository');
const ArticleRepository = require('../ArticleRepository');

class InMemoryArticleRepository extends InMemoryBaseRepository {
  constructor(initialData = []) {
    super(initialData);
  }

  async findPublished() {
    return this.findAll({ filter: { is_published: true }, orderBy: 'created_at', ascending: false });
  }

  async findBySlug(slug) {
    return this.findOne({ slug });
  }
}

module.exports = InMemoryArticleRepository;