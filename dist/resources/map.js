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
   * Map Schema
   * @type {SchemaObjectInstance<any>}
   */
};const Schema = (0, _base.initSchema)({
  type: { type: [String], required: true },
  author: { type: String, required: true },
  title: { type: String, required: true }
}, schemaOptions);

/**
 * Route access matrix by HTTP verb and OAuth grants
 */
schemaOptions.accessMatrix = {
  find: ['retrieve:maps'],
  get: ['retrieve:maps'],
  create: ['create:maps'],
  update: ['update:maps'],
  patch: ['update:maps'],
  remove: ['remove:maps']
};

exports.Schema = Schema;
exports.schemaOptions = schemaOptions;
exports.resourceHooks = resourceHooks;