import setup from '../core-api/setup-service'

const maps = {
  name: 'maps',
  path: '/maps',
  schema: {
    text: { type: String, required: true }
  }
}

export default function (backend) {
  return function (app) {
    setup(app, maps, backend)
  }
}
