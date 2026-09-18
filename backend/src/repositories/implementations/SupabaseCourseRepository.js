const SupabaseBaseRepository = require('./SupabaseBaseRepository');

class SupabaseCourseRepository extends SupabaseBaseRepository {
  constructor() {
    super('courses');
  }

  async findPublished() {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async findBySlug(slug) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('slug', slug)
      .limit(1);

    if (error) throw error;
    return data && data[0] ? data[0] : null;
  }
}

module.exports = SupabaseCourseRepository;
