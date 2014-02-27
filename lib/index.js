'use strict';

var contra = require('contra'),
  Q = require('q'),
  noop = function() {};


/**
 * MultiCache constructor.
 *
 * @param {Object} options
 * @api public
 */

// {
//   'L1': {
//     engine: "memory",
//     options: {
//       count: 50,
//       ttl: 200
//     }
//   },
//   'L2': {
//     engine: "file",
//     options: {
//       ttl: 200
//     }
//   }
// }



function MultiCache(options) {

  var self = this;

  self.L1 = _engine(options.L1.engine, options.L1.options);

  self.L1.options = options.L1;

  self.L2 = _engine(options.L2.engine, options.L2.options);

  self.L2.options = options.L2;

}

/**
 * Valid store engines.
 *
 * @type {Array}
 * @api public
 */
MultiCache.engines = ['memory', 'redis', 'file'];


/**
 * Set get engine.
 *
 * @param {String} engine
 * @param {Object} options
 * @return {MultiCache} self
 * @api public
 */

function _engine(engine, options) {

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

    return new Engine(options || {});

  }

}

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

  var deferred = Q.defer();

  contra.waterfall([

    function(callback) {

      self.L1.get(key, function(err, value) {

        return callback(null, value);

      });

    },

    function(value, callback) {

      if (value) {

        callback(null, value);

      } else {

        self.L2.get(key, function(err, value) {

          if (err) return callback(err, null);

          self.L1.set(key, value);

          return callback(null, value);

        });
      }
    }
  ], function(err, value) {

    if (err) {

      deferred.reject(err);

    } else {

      deferred.resolve(value);

    }


  });

  return deferred.promise.nodeify(fn);

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


  var deferred = Q.defer();

  contra.concurrent([

      function(callback) {

        self.L1.set(key, data, (self.L1.options.ttl || ttl), callback);

      },

      function(callback) {

        self.L2.set(key, data, (self.L2.options.ttl || ttl), callback);

      }

    ],

    function(err) {

      deferred.resolve(err);

    });


  return deferred.promise.nodeify(fn);



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

  var deferred = Q.defer();

  contra.concurrent([

      function(callback) {

        self.L1.del(key, callback);

      },

      function(callback) {

        self.L2.del(key, callback);

      }

    ],

    function(err) {

      deferred.resolve();

    });

    return deferred.promise.nodeify(fn);

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

  var deferred = Q.defer();

  contra.concurrent([

      function(callback) {

        self.L1.clear(callback);

      },

      function(callback) {

        self.L2.clear(callback);

      }
    ],

    function(err) {

      deferred.resolve();

    });

    return deferred.promise.nodeify(fn);

};

/**
 * Export `MultiCache`.
 */

module.exports = MultiCache;
