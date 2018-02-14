import TestHelper from './helper'

const assert = require('assert')
const rp = require('request-promise')

const app = TestHelper.getApp()

let listener

describe('Feathers application tests', () => {
  before(function (done) {
    TestHelper.startServer(app, result => {
      listener = result
      done()
    })
  })

  after(function (done) {
    listener.close(done)
  })

  it('starts and shows the index page', () => {
    return rp(TestHelper.getUrl(app)).then(body =>
      assert.ok(body.indexOf('<html>') !== -1)
    )
  })

  describe('404', function () {
    it('shows a 404 HTML page', () => {
      return rp({
        url: TestHelper.getUrl(app, 'path/to/nowhere'),
        headers: {
          'Accept': 'text/html'
        }
      }).catch(res => {
        assert.equal(res.statusCode, 404)
        assert.ok(res.error.indexOf('<html>') !== -1)
      })
    })

    it('shows a 404 JSON error without stack trace', () => {
      return rp({
        url: TestHelper.getUrl(app, 'path/to/nowhere'),
        json: true
      }).catch(res => {
        assert.equal(res.statusCode, 404)
        assert.equal(res.error.code, 404)
        assert.equal(res.error.message, 'Page not found')
        assert.equal(res.error.name, 'NotFound')
      })
    })
  })
})
