const VercelKVBaseRepository = require('./VercelKVBaseRepository');
const ArticleRepository = require('../ArticleRepository');

class VercelKVArticleRepository extends VercelKVBaseRepository {
  constructor() {
    super('articles');
  }

  async findPublished() {
    return this.findAll({ filter: { is_published: true }, orderBy: 'created_at', ascending: false });
  }

  async findBySlug(slug) {
    return this.findOne({ slug });
  }
}

module.exports = VercelKVArticleRepository;