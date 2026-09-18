const SupabaseBaseRepository = require('./SupabaseBaseRepository');

class SupabaseDownloadRepository extends SupabaseBaseRepository {
  constructor() {
    super('downloads');
  }
}

module.exports = SupabaseDownloadRepository;
