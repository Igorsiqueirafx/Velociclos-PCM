const SupabaseBaseRepository = require('./SupabaseBaseRepository');

class SupabaseCertificateRepository extends SupabaseBaseRepository {
  constructor() {
    super('certificates');
  }
}

module.exports = SupabaseCertificateRepository;
