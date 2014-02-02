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

  // check localstorage for item and clear the timeout
  if (window.localstorage.getItem(JSON.parse(key))) {
    var item = window.localstorage.getItem(JSON.parse(key));
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
        window.localstorage.delItem(key);
      }, time);
      record.timeout = timeout;
    })();
  }

  // store record to key to store in cache
  window.localstorage.setItem(key, JSON.stringify(record)));
}

// delete item in local storage
Memory.prototype.del = function(key) {
  var item = window.localstorage.getItem(JSON.parse(key));
  var record = item;

  if (!record) {
    return false;
  }

  clearTimeout(record.timeout);

  var isExpired = expired(record);
  window.localstorage.delItem(key);
  return !isExpired;
}

// need to be completed
Memory.prototype.clear = function() {
  var self = this;

  for (var key in self.cache) {
    clearTimeout(self.cache[key].timeout);
  }

  self.cache = {};
}

Memory.prototype.get = function(key) {
  var item = window.localstorage.getItem(JSON.parse(key));
  var record = item;
  if (typeof record != "undefined") {
    if (!expired(record)) {
      item.debug && ++item.hitCount;
      return record.value;
    } else {
      item.debug && ++item.missCount;
      window.localstorage.delItem(key);
    }
  }
  return null;
}

// need to be re-evaluated
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
  var item = window.localstorage.getItem(JSON.parse(key));
  return item.hitCount;
}

Memory.prototype.misses = function() {
  var item = window.localstorage.getItem(JSON.parse(key));
  return item.missCount;
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