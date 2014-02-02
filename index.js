function now() {
  return (new Date).getTime();
}

function expired(record) {
  return record.expire && record.expire < now();
}

var MultiCache = function() {
  var self = this;
  self.cache = {};
  self.debug = false;
  self.hitCount = 0;
  self.missCount = 0;

  return self;
}

MultiCache.prototype.put = function(key, value, time) {
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

MultiCache.prototype.del = function(key) {
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

MultiCache.prototype.clear = function() {
  var self = this;

  for (var key in self.cache) {
    clearTimeout(self.cache[key].timeout);
  }

  self.cache = {};
}

MultiCache.prototype.get = function(key) {
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

MultiCache.prototype.size = function() {
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

MultiCache.prototype.memsize = function() {
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

MultiCache.prototype.hits = function() {
  var self = this;
  return self.hitCount;
}

MultiCache.prototype.misses = function() {
  var self = this;
  return self.missCount;
}

MultiCache.shared = new MultiCache();

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
  module.exports = MultiCache;
} else {
  if (typeof(define) === 'function' && define.amd) {
    define([], function() {
      return MultiCache;
    });
  } else {
    window.MultiCache = MultiCache;
  }
}