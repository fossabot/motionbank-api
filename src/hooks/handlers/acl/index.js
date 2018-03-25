import Promise from 'bluebird'

/**
 * Access Control List functionality
 */
class ACL {
  /**
   * Checks access permissions on a list of resources
   * @param context
   * @return {Promise<void>}
   */
  static async filterResults (context) {
    const
      service = context.app.service('acls')
    const filtered = await Promise.map(context.result || [], async function (item) {
      const opts = {
        resource: item.uuid,
        actions: context.method
      }
      const entries = await ACL.checkPermission(service, context.params.user, opts)
      if (entries.length === 0) {
        return null
      }
      return item
    })
    return filtered.filter(item => {
      if (item !== null) return true
    })
  }

  /**
   * Checking access permissions for a resource
   * @param context
   * @returns {Object}
   */
  static async checkPermission (service, user, opts) {
    const
      query = ACL.buildQuery(
        user.uuid,
        opts.resource,
        opts.actions
      )
    const entries = await service.find(query)
    return entries
  }

  /**
   * Build ACL db query
   * @param user
   * @param resource
   * @param actions
   * @return {{user: *|uuid|{type, required}, resource: *, actions}}
   */
  static buildQuery (user, resource, actions) {
    return { query: { user, resource, actions } }
  }
}

export default ACL
