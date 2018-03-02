'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resourceHooks = exports.schemaOptions = exports.Schema = undefined;

var _base = require('../base');

const resourceHooks = {},
      schemaOptions = { idField: 'uuid'

  /**
   * Map Schema
   * @type {SchemaObjectInstance<any>}
   */
};const Schema = (0, _base.initSchema)({
  type: { type: String, required: true },
  author: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String }
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