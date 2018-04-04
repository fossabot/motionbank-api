'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _errors = require('@feathersjs/errors');

var _errors2 = _interopRequireDefault(_errors);

var _uuid = require('./uuid5');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const checkMethod = function () {
  return function (context) {
    const { app, params } = context,
          user = params.user,
          nsuuid = app.get('api.uuid.namespace');
    console.log('UUID', nsuuid);
    // TODO: add configurable id field
    if (!params.authenticated || !user || !user.uuid) {
      if (['get', 'find'].indexOf(context.method) === -1) {
        throw new _errors2.default.MethodNotAllowed();
      } else {
        params.user = { uuid: _uuid.UUID_NULL };
      }
    }
  };
};

exports.default = checkMethod;
module.exports = exports['default'];