'use strict';

var async = require('async'),
  noop = function() {};


/**
 * MultiCache constructor.
 *
 * @param {Object} options
 * @api public
 */

// {
//   'L1' :{
//     engine: "memory,
//     options: {}
//   },
//   'L2' :{
//     engine: "redis,
//     options: {}
//   }
// } 



function MultiCache(options) {

  var self = this;

  // TODO: Errors on object

  if (!(self instanceof MultiCache)) return new MultiCache(options);

  self.L1 = self.engine(options.L1.engine, options.L1.options);

  self.L2 = self.engine(options.L2.engine, options.L2.options);

}

/**
 * Valid store engines.
 *
 * @type {Array}
 * @api public
 */
MultiCache.engines = ['memory', 'redis,', 'file', 'mongo'];


/**
 * Set get engine.
 *
 * @param {String} engine
 * @param {Object} options
 * @return {MultiCache} self
 * @api public
 */

MultiCache.prototype.engine = function _engine(engine, options) {

  if (!arguments.length) return this._engine;

  if (!/string|function/.test(typeof engine)) {

    throw new Error('Invalid engine format, engine must be a String or Function');

  }

  if ('string' === typeof engine) {

    var Engine;

    if (~MultiCache.engines.indexOf(engine)) {

      engine = 'cacheman-' + engine;

    }

    try {

      Engine = require(engine);

    } catch (e) {

      if (e.code === 'MODULE_NOT_FOUND') {

        throw new Error('Missing required npm module ' + engine);

      } else {

        throw e;

      }

    }

    return new Engine(options || this.options, this);

  } else {

    return engine(options || this.options, this);

  }

};



// function MultiCache(engine, options){
// 'L1': {
// 'engine': 'memory',
// 'options': {}
// },
// 'L2': {
// 'engine': 'redis',
// 'options': {}
// }
// }

/**
 * Get an entry.
 *
 * @param {String} key
 * @param {Function} fn
 * @return {MultiCache} self
 * @api public
 */

MultiCache.prototype.get = function get(key, fn) {

  var self = this;

  self.L1.get(key, function(err, value) {

    if (value) {

      return fn(null, value);

    } else {

      self.L2.get(key, function(err, value) {

        if (err) return fn(err);

        self.L1.set(key, value);

        return fn(null, value);

      });
    }
  });

};

/**
 * Set an entry.
 *
 * @param {String} key
 * @param {Mixed} data
 * @param {Number} ttl
 * @param {Function} fn
 * @return {MultiCache} self
 * @api public
 */

MultiCache.prototype.set = function set(key, data, ttl, fn) {

  var self = this;

  if ('function' === typeof ttl) {

    fn = ttl;

    ttl = null;

  }

  fn = fn || noop;

  async.parallel([

      function(callback) {

        self.L1.set(key, data, ttl, callback);

      },

      function(callback) {

        self.L2.set(key, data, ttl, callback);

      }

    ],

    function(err) {

      fn(err);

    });

};

/**
 * Delete an entry.
 *
 * @param {String} key
 * @param {Function} fn
 * @return {MultiCache} self
 * @api public
 */

MultiCache.prototype.del = function del(key, fn) {
  var self = this;

  async.parallel([

      function(callback) {

        self.L1.del(key, callback);

      },

      function(callback) {

        self.L2.del(key, callback);

      }

    ],

    function(err) {

      fn(err);

    });

};

/**
 * Clear all entries.
 *
 * @param {String} key
 * @param {Function} fn
 * @return {MultiCache} self
 * @api public
 */

MultiCache.prototype.clear = function clear(fn) {

  var self = this;

  fn = fn || noop;

  async.parallel([

      function(callback) {

        self.L1.clear(callback);

      },

      function(callback) {

        self.L2.clear(callback);

      }
    ],

    function(err) {

      fn(err);

    });

};

/**
 * Export `MultiCache`.
 */

module.exports = MultiCache;