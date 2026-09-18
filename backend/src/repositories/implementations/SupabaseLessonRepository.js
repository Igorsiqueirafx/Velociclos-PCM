const SupabaseBaseRepository = require('./SupabaseBaseRepository');

class SupabaseLessonRepository extends SupabaseBaseRepository {
  constructor() {
    super('lessons');
  }
}

module.exports = SupabaseLessonRepository;
