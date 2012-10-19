_ = require 'underscore'
Backbone = require 'backbone4000'
v = require './index'

exports.validatedmodel = (test) ->
    testclass = v.ValidatedModel.extend4000 { validator: { bla: 'string', blu: 'number' } }
    x = new testclass({bla: 3})
    test.done()