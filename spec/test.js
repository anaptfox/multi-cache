var assert = require('assert'),
  Cache = require('../'),
  cache;

describe('multi-cache memory-file', function() {

  before(function(done) {
    cache = new Cache({
      'L1': {
        engine: 'memory',
        options: {
          count: 50,
          ttl: 200
        }
      },
      'L2': {
        engine: 'file',
        options: {
          ttl: 200
        }
      }
    });
    done();
  });

  after(function(done) {
    cache.clear();
    done();
  });

  it('should have main methods', function() {
    assert.ok(cache.set);
    assert.ok(cache.get);
    assert.ok(cache.del);
    assert.ok(cache.clear);
  });

  it('should store items', function(finish) {
    cache.set('test1', {
      a: 1
    }, function(err) {
      if (err) return finish(err);
      cache.get('test1', function(err, data) {
        if (err) return finish(err);
        assert.equal(data.a, 1);
        finish();
      });
    });
  });

  it('should store items with promise', function(finish) {
    cache.set('test1', {
      a: 1
    }).then(function() {
        cache.get('test1').then(function(data) {
            assert.equal(data.a, 1);
            finish();
          },
          function(err) {
            finish(err);
          });
      },
      function(err) {
        finish(err);
      }).done();
  });


  it('should store zero', function(done) {
    cache.set('test2', 0, function(err) {
      if (err) return done(err);
      cache.get('test2', function(err, data) {
        if (err) return done(err);
        assert.strictEqual(data, 0);
        done();
      });
    });
  });

  it('should store false', function(done) {
    cache.set('test3', false, function(err) {
      if (err) return done(err);
      cache.get('test3', function(err, data) {
        if (err) return done(err);
        assert.strictEqual(data, false);
        done();
      });
    });
  });

  it('should store null', function(done) {
    cache.set('test4', null, function(err) {
      if (err) return done(err);
      cache.get('test4', function(err, data) {
        if (err) return done(err);
        assert.strictEqual(data, null);
        done();
      });
    });
  });

  it('should delete items', function(done) {
    var value = Date.now();
    cache.set('test5', value, function(err) {
      if (err) return done(err);
      cache.get('test5', function(err, data) {
        if (err) return done(err);
        assert.equal(data, value);
        cache.del('test5', function(err) {
          if (err) return done(err);
          cache.get('test5', function(err, data) {
            if (err) return done(err);
            assert.equal(data, null);
            done();
          });
        });
      });
    });
  });

  it('should clear items', function(done) {
    var value = Date.now();
    cache.set('test6', value, function(err) {
      if (err) return done(err);
      cache.get('test6', function(err, data) {
        if (err) return done(err);
        assert.equal(data, value);
        cache.clear(function(err) {
          if (err) return done(err);
          cache.get('test6', function(err, data) {
            if (err) return done(err);
            assert.equal(data, null);
            done();
          });
        });
      });
    });
  });

  it('should expire key', function(done) {
    this.timeout(0);
    cache.set('test1', {
      a: 1
    }, 1, function(err) {
      if (err) return done(err);
      setTimeout(function() {
        cache.get('test1', function(err, data) {
          if (err) return done(err);
          assert.equal(data, null);
          done();
        });
      }, 1100);
    });
  });

});

describe('multi-cache file-memory', function() {

  before(function(done) {
    cache = new Cache({
      'L1': {
        engine: 'file',
        options: {
          ttl: 200
        }
      },
      'L2': {
        engine: 'memory',
        options: {
          count: 50,
          ttl: 200
        }
      }
    });
    done();
  });

  after(function(done) {
    cache.clear();
    done();
  });

  it('should have main methods', function() {
    assert.ok(cache.set);
    assert.ok(cache.get);
    assert.ok(cache.del);
    assert.ok(cache.clear);
  });

  it('should store items', function(finish) {
    cache.set('test1', {
      a: 1
    }, function(err) {
      if (err) return finish(err);
      cache.get('test1', function(err, data) {
        if (err) return finish(err);
        assert.equal(data.a, 1);
        finish();
      });
    });
  });

  it('should store items with promise', function(finish) {
    cache.set('test1', {
      a: 1
    }).then(function() {
        cache.get('test1').then(function(data) {
            assert.equal(data.a, 1);
            finish();
          },
          function(err) {
            finish(err);
          });
      },
      function(err) {
        finish(err);
      }).done();
  });


  it('should store zero', function(done) {
    cache.set('test2', 0, function(err) {
      if (err) return done(err);
      cache.get('test2', function(err, data) {
        if (err) return done(err);
        assert.strictEqual(data, 0);
        done();
      });
    });
  });

  it('should store false', function(done) {
    cache.set('test3', false, function(err) {
      if (err) return done(err);
      cache.get('test3', function(err, data) {
        if (err) return done(err);
        assert.strictEqual(data, false);
        done();
      });
    });
  });

  it('should store null', function(done) {
    cache.set('test4', null, function(err) {
      if (err) return done(err);
      cache.get('test4', function(err, data) {
        if (err) return done(err);
        assert.strictEqual(data, null);
        done();
      });
    });
  });

  it('should delete items', function(done) {
    var value = Date.now();
    cache.set('test5', value, function(err) {
      if (err) return done(err);
      cache.get('test5', function(err, data) {
        if (err) return done(err);
        assert.equal(data, value);
        cache.del('test5', function(err) {
          if (err) return done(err);
          cache.get('test5', function(err, data) {
            if (err) return done(err);
            assert.equal(data, null);
            done();
          });
        });
      });
    });
  });

  it('should clear items', function(done) {
    var value = Date.now();
    cache.set('test6', value, function(err) {
      if (err) return done(err);
      cache.get('test6', function(err, data) {
        if (err) return done(err);
        assert.equal(data, value);
        cache.clear(function(err) {
          if (err) return done(err);
          cache.get('test6', function(err, data) {
            if (err) return done(err);
            assert.equal(data, null);
            done();
          });
        });
      });
    });
  });

  it('should expire key', function(done) {
    this.timeout(0);
    cache.set('test1', {
      a: 1
    }, 1, function(err) {
      if (err) return done(err);
      setTimeout(function() {
        cache.get('test1', function(err, data) {
          if (err) return done(err);
          assert.equal(data, null);
          done();
        });
      }, 1100);
    });
  });

});
