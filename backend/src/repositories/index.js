// Repository Interfaces
const BaseRepository = require('./BaseRepository');
const CourseRepository = require('./CourseRepository');
const ModuleRepository = require('./ModuleRepository');
const LessonRepository = require('./LessonRepository');
const ArticleRepository = require('./ArticleRepository');
const CertificateRepository = require('./CertificateRepository');
const SubscriberRepository = require('./SubscriberRepository');
const DownloadRepository = require('./DownloadRepository');
const PageRepository = require('./PageRepository');

// In-Memory Implementations (always available)
const InMemoryBaseRepository = require('./implementations/InMemoryBaseRepository');
const InMemoryCourseRepository = require('./implementations/InMemoryCourseRepository');
const InMemoryModuleRepository = require('./implementations/InMemoryModuleRepository');
const InMemoryLessonRepository = require('./implementations/InMemoryLessonRepository');
const InMemoryArticleRepository = require('./implementations/InMemoryArticleRepository');
const InMemoryCertificateRepository = require('./implementations/InMemoryCertificateRepository');
const InMemorySubscriberRepository = require('./implementations/InMemorySubscriberRepository');
const InMemoryDownloadRepository = require('./implementations/InMemoryDownloadRepository');
const InMemoryPageRepository = require('./implementations/InMemoryPageRepository');

// Factory
const repositoryFactory = require('./RepositoryFactory');

module.exports = {
  // Interfaces
  BaseRepository,
  CourseRepository,
  ModuleRepository,
  LessonRepository,
  ArticleRepository,
  CertificateRepository,
  SubscriberRepository,
  DownloadRepository,
  PageRepository,

  // In-Memory Implementations
  InMemoryBaseRepository,
  InMemoryCourseRepository,
  InMemoryModuleRepository,
  InMemoryLessonRepository,
  InMemoryArticleRepository,
  InMemoryCertificateRepository,
  InMemorySubscriberRepository,
  InMemoryDownloadRepository,
  InMemoryPageRepository,

  // Factory
  repositoryFactory,
};