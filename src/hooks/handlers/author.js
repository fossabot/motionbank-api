/**
 * Add/set author field with current user id
 * @return {Function}
 */
export default function () {
  return context => {
    if (context.data) {
      context.data.author = context.params.payload.userId
    }
  }
}
