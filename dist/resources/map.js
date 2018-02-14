'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hooks = exports.schemaOptions = exports.Schema = undefined;

var _initSchema = require('libmb-base/init-schema');

var _initSchema2 = _interopRequireDefault(_initSchema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const hooks = {},
      schemaOptions = {};

/**
 * Map Schema
 * @type {SchemaObjectInstance<any>}
 */
const Schema = (0, _initSchema2.default)({
  owner: { type: String, required: true },
  title: { type: String, required: true }
});

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
exports.hooks = hooks;