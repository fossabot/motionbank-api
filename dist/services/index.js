'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _authentication = require('./authentication');

var _authentication2 = _interopRequireDefault(_authentication);

var _acl = require('./acl');

var _acl2 = _interopRequireDefault(_acl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Authentication: _authentication2.default,
  ACL: _acl2.default
};
module.exports = exports['default'];