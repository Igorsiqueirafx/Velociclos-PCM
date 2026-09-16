const BaseRepository = require('../BaseRepository');

class InMemoryBaseRepository extends BaseRepository {
  constructor(initialData = []) {
    super();
    this.data = [...initialData];
  }

  _generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async findAll(options = {}) {
    let data = [...this.data];
    
    if (options.filter) {
      data = data.filter(item => {
        return Object.entries(options.filter).every(([key, value]) => item[key] === value);
      });
    }

    if (options.orderBy) {
      const ascending = options.ascending !== false;
      data = data.sort((a, b) => {
        const aVal = a[options.orderBy] || '';
        const bVal = b[options.orderBy] || '';
        return ascending ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
      });
    }

    if (options.limit) {
      data = data.slice(0, options.limit);
    }

    return data;
  }

  async findById(id) {
    return this.data.find(item => item.id === id) || null;
  }

  async findOne(filter) {
    return this.data.find(item => {
      return Object.entries(filter).every(([key, value]) => item[key] === value);
    }) || null;
  }

  async create(data) {
    const newItem = {
      ...data,
      id: this._generateId(),
      created_at: new Date().toISOString(),
    };
    this.data.push(newItem);
    return newItem;
  }

  async update(id, data) {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    this.data[index] = {
      ...this.data[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return this.data[index];
  }

  async delete(id) {
    const initialLength = this.data.length;
    this.data = this.data.filter(item => item.id !== id);
    return this.data.length < initialLength;
  }

  async count(filter = {}) {
    const data = await this.findAll({ filter });
    return data.length;
  }

  // Helper method for testing - reset data
  reset(newData = []) {
    this.data = [...newData];
  }

  // Helper method for testing - get all data directly
  getAll() {
    return [...this.data];
  }
}

module.exports = InMemoryBaseRepository;