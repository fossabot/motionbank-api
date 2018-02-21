'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Static helper methods
 */
class Util {
  /**
   * Create query for ID field
   */
  static getIdQuery(id, idField) {
    const query = {};
    query[idField] = id;
    return query;
  }

  /**
   * Make sure only vanilla objects get passed
   */
  static getRawObject(data) {
    if (data && typeof data.toObject === 'function') {
      return data.toObject();
    }
    return data;
  }

  /**
   * Parse query input
   *
   * TODO: how should this be abstracted?
   * TODO: look into graphql
   * see: https://github.com/rollymaduk/feathers-apollo-server
   * and: https://medium.com/fuzz/the-electric-feathersjs-and-apollo-server-the-start-f338a744b34b
   */
  static parseQuery(query) {
    const qObj = Util.getRawObject(query);
    const q = {},
          opts = {};
    Object.entries(qObj).map(entry => {
      const [k, v] = entry;
      if (k[0] === '$') {
        opts[k] = v;
      } else {
        q[k] = v;
      }
    });
    return { q, opts };
  }

  static formatServiceResult(result, arrayWrap = true) {
    // TODO: add pagination
    if (arrayWrap) {
      result = Array.isArray(result) ? result : [result];
      return { data: result };
    }
    return result;
  }

  /**
   * Parse DB configs
   */
  static parseConfig(persistence, pconfig = {}) {
    const entries = Object.entries(pconfig) || {};
    let [type, options] = entries.pop();
    let Constructor;
    if (type === 'mongodb') {
      Constructor = persistence.MongoDB;
    } else if (type === 'nedb') {
      Constructor = persistence.NeDB;
    }
    return {
      Constructor,
      options
    };
  }

  /**
   * Make sure only simple vanilla objects get passed to DB
   */
  static wrapAsync(db, method, ...args) {
    return new Promise((resolve, reject) => {
      const cb = (err, result) => {
        if (err) return reject(err);
        resolve(result);
      };
      let [a1, a2] = args;
      if (method === 'find' && a1 && a2) {
        db[method](a1).limit(a2.$limit || 0).exec(cb);
      } else if (a1 && a2) {
        db[method](a1, a2, cb);
      } else if (a1) {
        db[method](a1, cb);
      }
    });
  }
}

exports.default = Util;
module.exports = exports['default'];