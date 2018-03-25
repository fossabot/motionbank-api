'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _authentication = require('./authentication');

var _authentication2 = _interopRequireDefault(_authentication);

var _proxy = require('./proxy');

var _proxy2 = _interopRequireDefault(_proxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Authentication: _authentication2.default,
  Proxy: _proxy2.default
};
module.exports = exports['default'];