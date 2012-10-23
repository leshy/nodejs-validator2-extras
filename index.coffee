# things that didn't quite fit into validator2 but I still frequently need
_ = require 'underscore'
Backbone = require 'backbone4000'
helpers = require 'helpers'
colors = require 'colors'

# inherit validator module
_.map require('validator2'), (value,property) -> exports[property] = value

# backbone model that uses validator on its own attributes (for initialization)
#
# feed call in this case should BLOCK. at least on the level of this object's init because we
# don't want other subclassed initialize functions to be called until verification is complete
exports.ValidatedModel = Backbone.Model.extend4000
    initialize: ->

        # used to validate local object attributes upon initialization
        if @validator then new exports.Validator(@validator).feed @attributes, (err,data) -> if err? then throw "model init invalid"

        # used to validate a superclass of a mixin
        if @superValidator then new exports.Validator(@superValidator).feed @constructor.__super__, (err,data) -> if err? then throw "Mixin super validator failed"


# method that can partially compile a validator to mongodb query
exports.Validator::mongo = ->
    switch @name().toLowerCase()
        when 'children' then helpers.hashmap @args[0], (value, key) -> x = new exports.Validator(value);x.mongo()
        when 'number' then { '$type': 1 }
        when 'string' then { '$type': 2 }
        when 'boolean' then {'$type': 8 }
        when 'exists' then { '$exists': true }
        when 'is' then @args[0]
        else "dunno (#{ name })"

exports.Select = (args...) ->
    if args.length < 3 or not args.length % 2 then throw "wrong number of arguments"
    target = args.shift()
    chew = -> if args.length
        pattern = exports.v args.shift(); callback = args.shift(); pattern.feed target, (err,data) -> if not err then callback data, chew else chew()
    chew()
    


