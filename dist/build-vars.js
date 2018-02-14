'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  const appConfig = pkg.appConfig,
        uuidUnknown = '00000000-0000-0000-0000-000000000000',
        idField = process.env.ID_FIELD || appConfig.idField,
        apiHost = process.env.API_HOST || (process.env.NODE_ENV === 'production' ? appConfig.apiHost : appConfig.apiHostLocal);

  return {
    apiHost,
    idField,
    uuidUnknown
  };
};

var _package = require('../package.json');

var pkg = _interopRequireWildcard(_package);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

module.exports = exports['default'];