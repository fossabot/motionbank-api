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
      schemaOptions = { idField: 'uuid'

  /**
   * Map Schema
   * @type {SchemaObjectInstance<any>}
   */
};const Schema = (0, _base.initSchema)({
  uuid: { type: String, required: true },
  actions: { type: [String], required: true },
  resource: { type: String, required: true },
  user: { type: String, required: true }
}, schemaOptions);

/**
 * Route access matrix by HTTP verb and OAuth grants
 */
schemaOptions.accessMatrix = {
  find: ['retrieve:acls'],
  get: ['retrieve:acls'],
  create: ['create:acls'],
  update: ['update:acls'],
  patch: ['update:acls'],
  remove: ['remove:acls']
};

exports.Schema = Schema;
exports.schemaOptions = schemaOptions;
exports.resourceHooks = resourceHooks;