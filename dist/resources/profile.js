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
   * Profile Schema
   * @type {SchemaObjectInstance<any>}
   */
};const Schema = (0, _base.initSchema)({

  // single field name
  name: { type: String },
  // double field name
  firstname: { type: String },
  lastname: { type: String },

  // organisational
  location: { type: String },
  latlon: [Number],
  organisation: { type: String },

  // personal
  birthday: { type: Date },
  nickname: { type: String },
  imageURL: { type: String },
  title: { type: String },
  gender: { type: String },

  // profile creator UUID
  author: { type: String, required: true },

  // UUID of 'Connect' object holding
  // external userIDs, etc.
  connect: { type: String, required: true }

}, schemaOptions);

/**
 * Route access matrix by HTTP verb and OAuth grants
 */
schemaOptions.accessMatrix = {
  find: ['find:profiles'],
  get: ['get:profiles'],
  create: ['create:profiles'],
  update: ['update:profiles'],
  patch: ['update:profiles'],
  remove: ['remove:profiles']
};

exports.Schema = Schema;
exports.schemaOptions = schemaOptions;
exports.resourceHooks = resourceHooks;