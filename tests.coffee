_ = require 'underscore'
Backbone = require 'backbone4000'
v = require './index'

exports.validatedmodel = (test) ->
    testclass = v.ValidatedModel.extend4000 { validator: { bla: 'string', blu: 'number' } }
    try x = new testclass({bla: 'bla', blu: 3}) catch err
        test.fail err
    try x = new testclass({bla: 'bla', blu: 'lala'}) catch err
        test.done()

exports.mongo = (test) ->
    mongo = new v.Validator({ bla: 'string', k: 'number', a: 3 }).mongo()
    test.deepEqual { bla: { '$type': 2 }, k: { '$type': 1 }, a: 3 }, mongo
    console.log(mongo)
    test.done()

