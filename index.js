var FileCache = require('./stores/file'),
  file = new FileCache(),
  MemoryCache = require('./stores/memory'),
  memory = new MemoryCache();


function now() {

  return (new Date).getTime();

}

function expired(record) {

  return record.expire && record.expire < now();

}

var MultiCache = function() {

  var self = this;

  self.cache = {};

  return self;

}

MultiCache.prototype.get = function(key) {

  var record = memory.get(key);

  if (!record) {

    record = file.get(key);

  }

  return record;

}

MultiCache.prototype.put = function(key, value, time) {

  memory.put(key, value, time);

  file.put(key, value, time);

}

MultiCache.prototype.del = function(key) {

  memory.del(key);

  file.del(key);

}

MultiCache.prototype.size = function(key) {

  return file.size();

}

MultiCache.prototype.clear = function() {

  memory.clear();

  file.clear();

}


MultiCache.shared = new MultiCache();

module.exports = MultiCache;