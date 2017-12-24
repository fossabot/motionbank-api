import defaultHooks from '../hooks/resource'

const setup = function (app, resource, backend) {
  const
    Model = backend.model(app, resource),
    paginate = app.get('paginate'),
    options = {name: resource.name, Model, paginate}

  app.use(resource.path, backend.createService(options))
  const hooks = Object.assign(Object.assign({}, defaultHooks), resource.hooks || {})
  app.service(resource.name).hooks(hooks)
}

export default setup