'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hooks = require('./hooks');

var _hooks2 = _interopRequireDefault(_hooks);

var _acl = require('./handlers/acl');

var _acl2 = _interopRequireDefault(_acl);

var _authentication = require('@feathersjs/authentication');

var _authentication2 = _interopRequireDefault(_authentication);

var _mergeDeep = require('merge-deep');

var _mergeDeep2 = _interopRequireDefault(_mergeDeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { authenticate } = _authentication2.default.hooks;

const resourceHooks = (0, _mergeDeep2.default)((0, _hooks2.default)(), {
  before: {
    all: [authenticate('jwt'), _acl2.default.hook]
  }
});

exports.default = resourceHooks;
module.exports = exports['default'];