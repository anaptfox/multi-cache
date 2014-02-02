var fs = require('fs-extra'),
  cwd = process.cwd();

function now() {
  return (new Date).getTime();
}

function expired(record) {
  return record.expire && record.expire < now();
}

var File = function() {
  var self = this;
  self.cache = {};
  self.debug = false;
  self.hitCount = 0;
  self.missCount = 0;

  fs.mkdirSync(path.join(cwd, "tmp"));

  return self;
}

File.prototype.put = function(key, value, time) {

  var self = this;

  var cacheData;

  var cacheFile = path.join(cwd, 'tmp', key + '.json');

  if (fs.existsSync(cacheFile)) {

    cacheData = require(cacheFile);

    clearTimeout(cacheJson.timeout);

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

  cacheData = record;

  fs.writeFileSync(cacheFile, JSON.stringify(cacheData, null, 4));

}

File.prototype.del = function(key) {

  var self = this;

  var record;

  var cacheFile = path.join(cwd, 'tmp', key + '.json');

  if (fs.existsSync(cacheFile)) {

    record = require(cacheFile);

  } else {

    return false;

  }

  if (!record) {

    return false;

  }

  clearTimeout(record.timeout);

  var isExpired = expired(record);

  fs.unlinkSync(cacheFile);

  return !isExpired;

}

File.prototype.clear = function() {

  // Delete tmp folder
  deleteFolderRecursive(path.join(cwd, "tmp"));
  // Recreate empty folder
  fs.mkdirSync(path.join(cwd, "tmp"));

}

File.prototype.get = function(key) {

  var self = this;

  var record;

  var cacheFile = path.join(cwd, 'tmp', key + '.json');

  if (fs.existsSync(cacheFile)) {

    record = require(cacheFile);

  } else {

    return null;

  }

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

File.prototype.size = function() {

  var self = this;

  var file_list = fs.readdirSync(path.join(cwd, 'tmp'));

  return file_list.length;

}


File.prototype.hits = function() {

  var self = this;

  return self.hitCount;

}

File.prototype.misses = function() {

  var self = this;

  return self.missCount;

}

File.shared = new File();


module.exports = File;

var deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index) {
      var curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};