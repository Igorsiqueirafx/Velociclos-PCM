class RepositoryFactory {
  constructor() {
    this.repositories = null;
    this.initialized = false;
  }

  initialize(config = {}) {
    if (this.initialized && !config.force) {
      return this.repositories;
    }

    const useSupabase = config.useSupabase !== false;
    const useInMemory = config.useInMemory || process.env.USE_IN_MEMORY === 'true';

    if (useSupabase && !useInMemory) {
      const SupabaseCourseRepository = require('./implementations/SupabaseCourseRepository');
      const SupabaseModuleRepository = require('./implementations/SupabaseModuleRepository');
      const SupabaseLessonRepository = require('./implementations/SupabaseLessonRepository');
      const SupabaseArticleRepository = require('./implementations/SupabaseArticleRepository');
      const SupabaseCertificateRepository = require('./implementations/SupabaseCertificateRepository');
      const SupabaseSubscriberRepository = require('./implementations/SupabaseSubscriberRepository');
      const SupabaseDownloadRepository = require('./implementations/SupabaseDownloadRepository');
      const SupabasePageRepository = require('./implementations/SupabasePageRepository');
      const SupabasePlaylistRepository = require('./implementations/SupabasePlaylistRepository');

      this.repositories = {
        courses: new SupabaseCourseRepository(),
        modules: new SupabaseModuleRepository(),
        lessons: new SupabaseLessonRepository(),
        articles: new SupabaseArticleRepository(),
        certificates: new SupabaseCertificateRepository(),
        subscribers: new SupabaseSubscriberRepository(),
        downloads: new SupabaseDownloadRepository(),
        pages: new SupabasePageRepository(),
        playlists: new SupabasePlaylistRepository(),
      };
    } else {
      const InMemoryCourseRepository = require('./implementations/InMemoryCourseRepository');
      const InMemoryModuleRepository = require('./implementations/InMemoryModuleRepository');
      const InMemoryLessonRepository = require('./implementations/InMemoryLessonRepository');
      const InMemoryArticleRepository = require('./implementations/InMemoryArticleRepository');
      const InMemoryCertificateRepository = require('./implementations/InMemoryCertificateRepository');
      const InMemorySubscriberRepository = require('./implementations/InMemorySubscriberRepository');
      const InMemoryDownloadRepository = require('./implementations/InMemoryDownloadRepository');
      const InMemoryPageRepository = require('./implementations/InMemoryPageRepository');

      this.repositories = {
        courses: new InMemoryCourseRepository(config.initialData?.courses || []),
        modules: new InMemoryModuleRepository(config.initialData?.modules || []),
        lessons: new InMemoryLessonRepository(config.initialData?.lessons || []),
        articles: new InMemoryArticleRepository(config.initialData?.articles || []),
        certificates: new InMemoryCertificateRepository(config.initialData?.certificates || []),
        subscribers: new InMemorySubscriberRepository(config.initialData?.subscribers || []),
        downloads: new InMemoryDownloadRepository(config.initialData?.downloads || []),
        pages: new InMemoryPageRepository(config.initialData?.pages || []),
      };
    }

    this.initialized = true;
    return this.repositories;
  }

  getRepositories() {
    if (!this.initialized) {
      return this.initialize();
    }
    return this.repositories;
  }

  getRepository(name) {
    const repos = this.getRepositories();
    return repos[name];
  }

  setRepositories(customRepos) {
    this.repositories = customRepos;
    this.initialized = true;
  }

  reset() {
    this.repositories = null;
    this.initialized = false;
  }
}

module.exports = new RepositoryFactory();
