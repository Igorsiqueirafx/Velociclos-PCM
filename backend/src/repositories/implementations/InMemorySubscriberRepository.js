const InMemoryBaseRepository = require('./InMemoryBaseRepository');
const SubscriberRepository = require('../SubscriberRepository');

class InMemorySubscriberRepository extends InMemoryBaseRepository {
  constructor(initialData = []) {
    super(initialData);
  }

  async findByEmail(email) {
    return this.findOne({ email });
  }
}

module.exports = InMemorySubscriberRepository;