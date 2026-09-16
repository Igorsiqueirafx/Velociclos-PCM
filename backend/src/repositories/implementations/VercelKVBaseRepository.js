const { kv } = require('@vercel/kv');
const BaseRepository = require('../BaseRepository');

class VercelKVBaseRepository extends BaseRepository {
  constructor(tableName) {
    super();
    this.tableName = tableName;
  }

  async _getAll() {
    const data = await kv.get(this.tableName);
    return data || [];
  }

  async _saveAll(data) {
    await kv.set(this.tableName, data);
  }

  _generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async findAll(options = {}) {
    let data = await this._getAll();
    
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
    const data = await this._getAll();
    return data.find(item => item.id === id) || null;
  }

  async findOne(filter) {
    const data = await this._getAll();
    return data.find(item => {
      return Object.entries(filter).every(([key, value]) => item[key] === value);
    }) || null;
  }

  async create(data) {
    const allData = await this._getAll();
    const newItem = {
      ...data,
      id: this._generateId(),
      created_at: new Date().toISOString(),
    };
    allData.push(newItem);
    await this._saveAll(allData);
    return newItem;
  }

  async update(id, data) {
    const allData = await this._getAll();
    const index = allData.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    allData[index] = {
      ...allData[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    await this._saveAll(allData);
    return allData[index];
  }

  async delete(id) {
    const allData = await this._getAll();
    const filtered = allData.filter(item => item.id !== id);
    await this._saveAll(filtered);
    return true;
  }

  async count(filter = {}) {
    const data = await this.findAll({ filter });
    return data.length;
  }
}

module.exports = VercelKVBaseRepository;