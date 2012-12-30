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

exports.AccessorModel = (test) ->
    testmodel = Backbone.Model.extend4000(
        v.MakeAccessors
            bla: v.v().boolean()
            blu: v.v().number()
        initialize: -> 3 + 3
        )

    x = new testmodel()
    x.bla(true)
    test.equals x.get('bla'), true

    x.bla(false).blu(666)
    test.equals x.get('bla'), false
    test.equals x.get('blu'), 666
    
    try
        x.bla(33)
    catch err
        test.done()

exports.ValidatedFunction = (test) ->
    cnt = 0
    
    X = Backbone.Model.extend4000
        testf: v.Validated({ 0: 'Number', 1: 'String' }, (n,str,callback) ->
            cnt++
            callback undefined, [ n, str ])

    x = new X()

    x.testf 3, 'teststring', (err,data) ->
        if err then test.fail()
        if not data then test.fail()
        if cnt isnt 1 then test.fail()

    x.testf 4, 6, (err,data) ->
        if not err then test.fail()
        if cnt isnt 1 then test.fail()
        test.done()
    
    
    