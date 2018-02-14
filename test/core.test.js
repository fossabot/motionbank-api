import TestHelper from './helper'
import assert from 'assert'

describe('CoreAPI', () => {
  it('initializes a new API instance', done => {
    TestHelper.startServer(TestHelper.getApp(), listener => {
      assert(listener)
      assert.equal(typeof listener.close, 'function')
      listener.close(done)
    })
  })
})
