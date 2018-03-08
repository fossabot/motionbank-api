/* eslint no-return-await: off */
import Backend from 'acl/lib/backend'

/**
 * Database adapter to connect persistence to ACL
 */
class DBAdapter extends Backend {
  /**
   * Sets a persistence configuration
   * @param Constructor
   * @param options
   */
  setPersistence (Constructor, options, idField) {
    this._db = new Constructor(options, idField)
    this._options = options
  }

  /**
   * Get persistence adapter instance
   * @returns {Constructor|*}
   */
  get db () {
    return this._db
  }

  /**
   * Get persistence options
   * @returns {*}
   */
  get options () {
    return this._options
  }

  /**
   * Begin transaction
   * @returns {Array}
   */
  begin () {
    return []
  }

  /**
   * Ends and executes a transaction
   * @param transaction
   * @param cb
   * @returns {Promise<any[]>}
   */
  async end (transaction, cb) {
    super.end(transaction, cb)
    return await Promise.all(transaction)
  }

  /**
   * Clean database
   * @param cb
   * @returns {Promise<void>}
   */
  async clean (cb) {
    super.clean(cb)
  }

  /**
   * Gets the contents at the bucket's key
   * @param bucket
   * @param key
   * @param cb
   * @returns {Promise<void>}
   */
  async get (bucket, key, cb) {
    super.get(bucket, key, cb)
  }

  /**
   * Gets the union of contents of the specified
   * keys in each of the specified buckets and
   * returns a mapping of bucket to union.
   * @param bucket
   * @param keys
   * @param cb
   * @returns {Promise<void>}
   */
  async unions (bucket, keys, cb) {
    super.unions(bucket, keys, cb)
  }

  /**
   * Returns the union of the values in the given keys.
   * @param bucket
   * @param keys
   * @param cb
   * @returns {Promise<void>}
   */
  async union (bucket, keys, cb) {
    super.union(bucket, keys, cb)
  }

  /**
   * Adds values to a given key inside a bucket.
   * @param transaction
   * @param bucket
   * @param key
   * @param values
   * @returns {Promise<void>}
   */
  async add (transaction, bucket, key, values) {
    super.union(transaction, bucket, key, values)
  }

  /**
   * Delete the given key(s) at the bucket
   * @param transaction
   * @param bucket
   * @param keys
   * @returns {Promise<void>}
   */
  async del (transaction, bucket, keys) {
    super.del(transaction, bucket, keys)
  }
}

export default DBAdapter
