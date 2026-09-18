const SupabaseBaseRepository = require('./SupabaseBaseRepository');

class SupabaseModuleRepository extends SupabaseBaseRepository {
  constructor() {
    super('modules');
  }
}

module.exports = SupabaseModuleRepository;
