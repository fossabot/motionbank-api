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
    let user;
    const { app, params } = context,
          nsuuid = app.get('api.uuid.namespace');

    try {
      user = { uuid: params.payload.userId };
    } catch (e) {
      user = params.user;
    }

    console.log('Namespace UUID', nsuuid);
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