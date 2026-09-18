const SupabaseBaseRepository = require('./SupabaseBaseRepository');

class SupabasePageRepository extends SupabaseBaseRepository {
  constructor() {
    super('pages');
  }
}

module.exports = SupabasePageRepository;
