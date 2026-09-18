const SupabaseBaseRepository = require('./SupabaseBaseRepository');

class SupabaseArticleRepository extends SupabaseBaseRepository {
  constructor() {
    super('articles');
  }
}

module.exports = SupabaseArticleRepository;
