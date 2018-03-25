'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hooks = require('../base/hooks');

var _hooks2 = _interopRequireDefault(_hooks);

var _method = require('./handlers/method');

var _method2 = _interopRequireDefault(_method);

var _hooks3 = require('./handlers/acl/hooks');

var _hooks4 = _interopRequireDefault(_hooks3);

var _authentication = require('@feathersjs/authentication');

var _authentication2 = _interopRequireDefault(_authentication);

var _mergeDeep = require('merge-deep');

var _mergeDeep2 = _interopRequireDefault(_mergeDeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { authenticate } = _authentication2.default.hooks;

const resourceHooks = (0, _mergeDeep2.default)((0, _hooks2.default)(), {
  before: {
    all: [authenticate('jwt'), (0, _method2.default)()],
    get: [_hooks4.default.permissionHook],
    update: [_hooks4.default.permissionHook],
    patch: [_hooks4.default.permissionHook],
    remove: [_hooks4.default.permissionHook, _hooks4.default.removeACLHook]
  },
  after: {
    find: [_hooks4.default.filterHook],
    create: [_hooks4.default.createACLHook]
  }
});

exports.default = resourceHooks;
module.exports = exports['default'];