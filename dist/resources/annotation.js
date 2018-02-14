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
 * Annotation Schema
 * @type {SchemaObjectInstance<any>}
 */
const Schema = (0, _initSchema2.default)({
  author: { type: String, required: true },
  subject: { type: String, required: true },
  object: { type: String, required: true },
  predicate: { type: String },
  context: { type: String },
  body: { type: String, required: true }
});

/**
 * Route access matrix by HTTP verb and OAuth grants
 */
schemaOptions.accessMatrix = {
  find: ['retrieve:annotations'],
  get: ['retrieve:annotations'],
  create: ['create:annotations'],
  update: ['update:annotations'],
  patch: ['update:annotations'],
  remove: ['remove:annotations']
};

exports.Schema = Schema;
exports.schemaOptions = schemaOptions;
exports.hooks = hooks;