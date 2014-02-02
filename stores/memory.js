function now() {

  return (new Date).getTime();

}

function expired(record) {

  return record.expire && record.expire < now();

}

var Memory = function() {

  var self = this;

  self.cache = {};

  self.debug = false;

  self.hitCount = 0;

  self.missCount = 0;

  return self;

}

Memory.prototype.put = function(key, value, time) {

  var self = this;

  if (self.cache[key]) {

    clearTimeout(self.cache[key].timeout);
  }

  var record = {

    value: value,

    expire: time ? (time + now()) : null

  };

  if (record.expire) {

    (function() {

      var _self = self;

      var timeout = setTimeout(function() {

        _self.del(key);

      }, time);

      record.timeout = timeout;

    })();

  }

  self.cache[key] = record;

}

Memory.prototype.del = function(key) {

  var self = this;

  var record = self.cache[key];

  if (!record) {

    return false;

  }

  clearTimeout(record.timeout);

  var isExpired = expired(record);

  delete self.cache[key];

  return !isExpired;

}

Memory.prototype.clear = function() {

  var self = this;

  for (var key in self.cache) {

    clearTimeout(self.cache[key].timeout);

  }

  self.cache = {};

}

Memory.prototype.get = function(key) {

  var self = this;

  var record = self.cache[key];

  if (typeof record != "undefined") {

    if (!expired(record)) {

      self.debug && ++self.hitCount;

      return record.value;

    } else {

      self.debug && ++self.missCount;

      self.del(key);

    }

  }

  return null;

}

Memory.prototype.size = function() {

  var self = this;

  var size = 0,
    key;

  for (key in self.cache) {

    if (self.cache.hasOwnProperty(key)) {

      if (self.get(key) !== null) {

        size++;

      }

    }

  }

  return size;

}

Memory.prototype.memsize = function() {

  var self = this;

  var size = 0,
    key;

  for (key in self.cache) {

    if (self.cache.hasOwnProperty(key)) {

      size++;

    }

  }

  return size;

}

Memory.prototype.hits = function() {

  var self = this;

  return self.hitCount;

}

Memory.prototype.misses = function() {

  var self = this;

  return self.missCount;

}

Memory.shared = new Memory();

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {

  module.exports = Memory;

} else {

  if (typeof(define) === 'function' && define.amd) {

    define([], function() {

      return Memory;

    });

  } else {

    window.Memory = Memory;

  }

}