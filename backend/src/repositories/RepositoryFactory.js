class RepositoryFactory {
  constructor() {
    this.repositories = null;
    this.initialized = false;
  }

  initialize(config = {}) {
    if (this.initialized && !config.force) {
      return this.repositories;
    }

    const useInMemory = config.useInMemory || process.env.USE_IN_MEMORY === 'true';
    const initialData = config.initialData || {};

    if (useInMemory) {
      // Lazy require in-memory implementations
      const InMemoryCourseRepository = require('./implementations/InMemoryCourseRepository');
      const InMemoryModuleRepository = require('./implementations/InMemoryModuleRepository');
      const InMemoryLessonRepository = require('./implementations/InMemoryLessonRepository');
      const InMemoryArticleRepository = require('./implementations/InMemoryArticleRepository');
      const InMemoryCertificateRepository = require('./implementations/InMemoryCertificateRepository');
      const InMemorySubscriberRepository = require('./implementations/InMemorySubscriberRepository');
      const InMemoryDownloadRepository = require('./implementations/InMemoryDownloadRepository');
      const InMemoryPageRepository = require('./implementations/InMemoryPageRepository');

      this.repositories = {
        courses: new InMemoryCourseRepository(initialData.courses || []),
        modules: new InMemoryModuleRepository(initialData.modules || []),
        lessons: new InMemoryLessonRepository(initialData.lessons || []),
        articles: new InMemoryArticleRepository(initialData.articles || []),
        certificates: new InMemoryCertificateRepository(initialData.certificates || []),
        subscribers: new InMemorySubscriberRepository(initialData.subscribers || []),
        downloads: new InMemoryDownloadRepository(initialData.downloads || []),
        pages: new InMemoryPageRepository(initialData.pages || []),
      };
    } else {
      // Lazy require Vercel KV implementations only when needed
      const VercelKVCourseRepository = require('./implementations/VercelKVCourseRepository');
      const VercelKVModuleRepository = require('./implementations/VercelKVModuleRepository');
      const VercelKVLessonRepository = require('./implementations/VercelKVLessonRepository');
      const VercelKVArticleRepository = require('./implementations/VercelKVArticleRepository');
      const VercelKVCertificateRepository = require('./implementations/VercelKVCertificateRepository');
      const VercelKVSubscriberRepository = require('./implementations/VercelKVSubscriberRepository');
      const VercelKVDownloadRepository = require('./implementations/VercelKVDownloadRepository');
      const VercelKVPageRepository = require('./implementations/VercelKVPageRepository');

      this.repositories = {
        courses: new VercelKVCourseRepository(),
        modules: new VercelKVModuleRepository(),
        lessons: new VercelKVLessonRepository(),
        articles: new VercelKVArticleRepository(),
        certificates: new VercelKVCertificateRepository(),
        subscribers: new VercelKVSubscriberRepository(),
        downloads: new VercelKVDownloadRepository(),
        pages: new VercelKVPageRepository(),
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