'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _authExpress = require('./auth-express');

var _authExpress2 = _interopRequireDefault(_authExpress);

var _proxy = require('./proxy');

var _proxy2 = _interopRequireDefault(_proxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  AuthExpress: _authExpress2.default,
  Proxy: _proxy2.default
};
module.exports = exports['default'];