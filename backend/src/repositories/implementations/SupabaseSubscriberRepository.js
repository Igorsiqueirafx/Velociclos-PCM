const SupabaseBaseRepository = require('./SupabaseBaseRepository');

class SupabaseSubscriberRepository extends SupabaseBaseRepository {
  constructor() {
    super('subscribers');
  }
}

module.exports = SupabaseSubscriberRepository;
