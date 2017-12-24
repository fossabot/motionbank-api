import setup from '../core/services/setup'

const maps = {
  name: 'maps',
  path: '/maps',
  schema: {
    text: { type: String, required: true }
  }
}

export default function (persistence) {
  return function (app) {
    setup(app, maps, persistence)
  }
}
