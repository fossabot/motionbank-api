import ACL from './index'
import errors from '@feathersjs/errors'

class ACLHooks {
  /**
   * Hook to check access permissions
   * @param context
   * @return {Promise<*>}
   */
  static async permissionHook (context) {
    const service = context.app.service('acls')
    const opts = {
      // TODO: full href or path?
      resource: context.id || context.path,
      actions: context.method
    }
    const entries = await ACL.checkPermission(service, context.params.user, opts)
    if (entries.length === 0) {
      throw new errors.Forbidden()
    }
    return context
  }

  /**
   * Create a new ACL entry after resource creation
   * @param context
   * @return {Promise<*>}
   */
  static async createACLHook (context) {
    await context.app.service('acls').create({
      user: context.params.user.uuid,
      resource: context.result.uuid,
      actions: ['find', 'get', 'update', 'patch', 'remove']
    })
    return context
  }

  /**
   * Remove an ACL entry on resource removal
   * @param context
   * @return {Promise<*>}
   */
  static async removeACLHook (context) {
    await context.app.service('acls').remove({
      user: context.params.user.uuid,
      resource: context.id
    })
    return context
  }

  /**
   * Hook for filtering find results
   * @param context
   * @return {Promise<*>}
   */
  static async filterHook (context) {
    const items = await ACL.filterResults(context)
    context.result = items
    return context
  }
}

export default ACLHooks
