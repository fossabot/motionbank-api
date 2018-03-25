'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _errors = require('@feathersjs/errors');

var _errors2 = _interopRequireDefault(_errors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ACLHooks {
  /**
   * Hook to check access permissions
   * @param context
   * @return {Promise<*>}
   */
  static async permissionHook(context) {
    const service = context.app.service('acls');
    const opts = {
      // TODO: full href or path?
      resource: context.id || context.path,
      actions: context.method
    };
    const entries = await _index2.default.checkPermission(service, context.params.user, opts);
    if (entries.length === 0) {
      throw new _errors2.default.Forbidden();
    }
    return context;
  }

  /**
   * Create a new ACL entry after resource creation
   * @param context
   * @return {Promise<*>}
   */
  static async createACLHook(context) {
    await context.app.service('acls').create({
      user: context.params.user.uuid,
      resource: context.result.uuid,
      actions: ['find', 'get', 'update', 'patch', 'remove']
    });
    return context;
  }

  /**
   * Remove an ACL entry on resource removal
   * @param context
   * @return {Promise<*>}
   */
  static async removeACLHook(context) {
    await context.app.service('acls').remove({
      user: context.params.user.uuid,
      resource: context.id
    });
    return context;
  }

  /**
   * Hook for filtering find results
   * @param context
   * @return {Promise<*>}
   */
  static async filterHook(context) {
    const items = await _index2.default.filterResults(context);
    context.result = items;
    return context;
  }
}

exports.default = ACLHooks;
module.exports = exports['default'];