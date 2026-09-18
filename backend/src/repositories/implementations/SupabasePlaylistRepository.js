const SupabaseBaseRepository = require('./SupabaseBaseRepository');

class SupabasePlaylistRepository extends SupabaseBaseRepository {
  constructor() {
    super('playlists');
  }
}

module.exports = SupabasePlaylistRepository;
