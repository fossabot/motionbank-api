const before = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
}
const after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
}
const error = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
}

const hooks = function () {
  return Object.assign({}, {
    before: Object.assign({}, before),
    after: Object.assign({}, after),
    error: Object.assign({}, error)
  })
}

export default hooks
