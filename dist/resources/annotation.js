'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hooks = exports.schemaOptions = exports.Schema = undefined;

var _base = require('@motionbank-js/base');

const hooks = {},
      schemaOptions = { idField: 'uuid'

  /**
   * Annotation Schema
   * @type {SchemaObjectInstance<any>}
   */
};const Schema = (0, _base.initSchema)({
  author: { type: String, required: true },
  subject: { type: String, required: true },
  object: { type: String, required: true },
  predicate: { type: String },
  context: { type: String },
  body: { type: String, required: true }
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
exports.hooks = hooks;