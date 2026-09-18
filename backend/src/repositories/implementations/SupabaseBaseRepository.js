const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_SECRET_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL/key are not configured');
}

const supabase = createClient(supabaseUrl, supabaseKey);

class SupabaseBaseRepository {
  constructor(table) {
    this.table = table;
  }

  async findAll(options = {}) {
    const { filter = {}, orderBy = 'created_at', ascending = false } = options;
    let query = supabase.from(this.table).select('*');

    for (const [key, value] of Object.entries(filter)) {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    }

    query = query.order(orderBy, { ascending });
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async findOne(options = {}) {
    const { filter = {} } = options;
    let query = supabase.from(this.table).select('*');

    for (const [key, value] of Object.entries(filter)) {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    }

    const { data, error } = await query.limit(1);
    if (error) throw error;
    return data && data[0] ? data[0] : null;
  }

  async create(payload = {}) {
    const { data, error } = await supabase.from(this.table).insert(payload).select('*').single();
    if (error) throw error;
    return data;
  }

  async update(id, payload = {}) {
    const { data, error } = await supabase.from(this.table).update(payload).eq('id', id).select('*').single();
    if (error) throw error;
    return data;
  }

  async delete(id) {
    const { error } = await supabase.from(this.table).delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  async upsert(payload = {}) {
    const { data, error } = await supabase.from(this.table).upsert(payload).select('*').single();
    if (error) throw error;
    return data;
  }
}

module.exports = SupabaseBaseRepository;
