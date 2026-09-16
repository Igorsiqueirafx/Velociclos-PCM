const VercelKVBaseRepository = require('./VercelKVBaseRepository');
const SubscriberRepository = require('../SubscriberRepository');

class VercelKVSubscriberRepository extends VercelKVBaseRepository {
  constructor() {
    super('subscribers');
  }

  async findByEmail(email) {
    return this.findOne({ email });
  }
}

module.exports = VercelKVSubscriberRepository;