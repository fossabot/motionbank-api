import superagent from 'superagent'

export default function Proxy () {
  return function (app) {
    app.use('/proxy', function (req, res, next) {
      superagent.get(req.query.url)
        .then(result => {
          res.setHeader('Content-Type', result.type)
          res.end(result.text)
        })
        .catch(() => {
          res.statusCode(404)
          res.end()
        })
    })
  }
}
