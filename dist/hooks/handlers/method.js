'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _buildVars = require('../../build-vars');

var _buildVars2 = _interopRequireDefault(_buildVars);

var _errors = require('@feathersjs/errors');

var _errors2 = _interopRequireDefault(_errors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const checkMethod = function () {
  return function (context) {
    const { params } = context,
          user = params.user;
    // TODO: add configurable id field
    if (!params.authenticated || !user || !user.uuid) {
      if (['get', 'find'].indexOf(context.method) === -1) {
        throw new _errors2.default.MethodNotAllowed();
      } else {
        params.user = { uuid: (0, _buildVars2.default)().uuidUnknown };
      }
    }
  };
};

exports.default = checkMethod;
module.exports = exports['default'];