function now() {

  return (new Date).getTime();

}

function expired(record) {

  return record.expire && record.expire < now();

}

var LocalStorage = function() {

  var self = this;

  self.cache = {};

  self.debug = false;

  self.hitCount = 0;

  self.missCount = 0;

  return self;
}

LocalStorage.prototype.put = function(key, value, time) {

  var self = this;

  var _self = self;

  var item = window.localstorage.getItem(key);

  // check localstorage for item and clear the timeout
  if (item) {

    item = JSON.parse(item);

    clearTimeout(item.timeout);

  }

  var record = {

    value: value,

    expire: time ? (time + now()) : null

  };

  // set timeout for item to store in cache
  if (record.expire) {

    (function() {

      var timeout = setTimeout(function() {

        _self.del(key);

      }, time);

      record.timeout = timeout;

    })();

  }

  // store record to key to store in cache
  window.localstorage.setItem(key, JSON.stringify(record)));

}

// delete item in local storage
LocalStorage.prototype.del = function(key) {

  var item = window.localstorage.getItem(key);

  if (!item) {

    return false;

  }

  var record = JSON.parse(item);

  clearTimeout(record.timeout);

  var isExpired = expired(record);

  window.localstorage.removeItem(key);

  return !isExpired;

}

LocalStorage.prototype.clear = function() {
  // TODO
}

LocalStorage.prototype.get = function(key) {

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

LocalStorage.prototype.memsize = function() {
  // TODO
}

LocalStorage.prototype.hits = function() {

  var self = this;

  return self.hitCount;

}

LocalStorage.prototype.misses = function() {

  var self = this;

  return self.missCount;

}

LocalStorage.shared = new LocalStorage();

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
  module.exports = LocalStorage;
} else {
  if (typeof(define) === 'function' && define.amd) {
    define([], function() {
      return LocalStorage;
    });
  } else {
    window.LocalStorage = LocalStorage;
  }
}