'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resourceHooks = exports.schemaOptions = exports.Schema = undefined;

var _base = require('../base');

const resourceHooks = {},
      schemaOptions = { idField: 'uuid'

  /**
   * Annotation Schema
   * @type {SchemaObjectInstance<any>}
   */
};const Schema = (0, _base.initSchema)({
  author: { type: String, required: true },
  target: { type: String, required: true },
  body: { type: String, required: true },
  type: { type: String, required: true },
  context: { type: String }
}, schemaOptions);

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
exports.resourceHooks = resourceHooks;