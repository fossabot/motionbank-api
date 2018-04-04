'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resourceHooks = exports.schemaOptions = exports.Schema = undefined;

var _base = require('../base');

var _hooks = require('../hooks');

var _hooks2 = _interopRequireDefault(_hooks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const resourceHooks = _hooks2.default.resource,
      schemaOptions = { idField: 'uuid', created: true, updated: true

  /**
   * Identity Schema
   *
   * @type {SchemaObjectInstance<any>}
   */
};const Schema = (0, _base.initSchema)({
  // TODO: maybe generate UUIDv5 from email?
  email: { type: String, required: true },
  // if using local strategy
  password: { type: String, minLength: 6, invisible: true },
  // all external IDs go here
  // for querying
  sub: [String]
}, schemaOptions);

/**
 * Route access matrix by HTTP verb and OAuth grants
 */
schemaOptions.accessMatrix = {
  find: ['find:identity'],
  get: ['get:identity'],
  create: ['create:identity'],
  update: ['update:identity'],
  patch: ['update:identity'],
  remove: ['remove:identity']
};

exports.Schema = Schema;
exports.schemaOptions = schemaOptions;
exports.resourceHooks = resourceHooks;