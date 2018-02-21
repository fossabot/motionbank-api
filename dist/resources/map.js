'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hooks = exports.schemaOptions = exports.Schema = undefined;

var _base = require('@motionbank-js/base');

const hooks = {},
      schemaOptions = { idField: 'uuid'

  /**
   * Map Schema
   * @type {SchemaObjectInstance<any>}
   */
};const Schema = (0, _base.initSchema)({
  owner: { type: String, required: true },
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
exports.hooks = hooks;