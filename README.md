# multi-cache



## Instalation

``` bash
$ npm install multi-cache
```

## Usage

```javascript
var MultiCache = require('multi-cache');
var cache = new MultiCache();

// set the value
cache.set('my key', { foo: 'bar' }, function (error) {

  if (error) throw error;

  // get the value
  cache.get('my key', function (error, value) {

    if (error) throw error;

    console.log(value); //-> {foo:"bar"}

    // delete entry
    cache.del('my key', function (error){
      
      if (error) throw error;

      console.log('value deleted');
    });

  });
});
```

## API

### MultiCache()

Create `multi-cache` instance.

```javascript
var cache = new MultiCache();
```

### cache.set(key, value, [ttl, [fn]])

Stores or updates a value.

```javascript
cache.set('foo', { a: 'bar' }, function (err, value) {
  if (err) throw err;
  console.log(value); //-> {a:'bar'}
});
```

Or add a TTL(Time To Live) in seconds like this:

```javascript
// key will expire in 60 seconds
cache.set('foo', { a: 'bar' }, 60, function (err, value) {
  if (err) throw err;
  console.log(value); //-> {a:'bar'}
});
```

### cache.get(key, fn)

Retrieves a value for a given key, if there is no value for the given key a null value will be returned.

```javascript
cache.get(function (err, value) {
  if (err) throw err;
  console.log(value);
});
```

### cache.del(key, [fn])

Deletes a key out of the cache.

```javascript
cache.del('foo', function (err) {
  if (err) throw err;
  // foo was deleted
});
```

### cache.clear([fn])

Clear the cache entirely, throwing away all values.

```javascript
cache.clear(function (err) {
  if (err) throw err;
  // cache is now clear
});
```

## Run tests

``` bash
$ make test
```

## License

(The MIT License)

Copyright (c) 2013 Taron Foxworth &lt;taronfoxworth@gmail.com&gt; , Jeremiah Harlan &lt;jeremiah.harlan@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
# tinycache

A simple, small (~100 lines) in-memory cache for node.js or the browser (~1.5KB minified).

## Installation

    npm install tinycache

## Usage

### Node

    var TinyCache = require( 'tinycache' );
    var cache = new TinyCache();

    // now just use the cache

    cache.put( 'foo', 'bar' );
    console.log( cache.get( 'foo' ) );

    // that wasn't too interesting, here's the good part

    cache.put( 'houdini', 'disapear', 100 ); // Time in ms
    console.log( 'Houdini will now ' + cache.get( 'houdini' ) );

    setTimeout( function() {
      console.log( 'Houdini is ' + cache.get( 'houdini' ) );
    }, 200 );
    
    // don't want to allocate separate caches?
    // there's also a default shared cache:
    var sharedCache = Cache.shared;
    sharedCache.put( 'foo', 'bar' );

    // or you could grab it in a one-liner
    var theSharedCache = require( 'tinycache' ).shared;

### Browser

#### Using Component (http://component.io)

    component install andyburke/tinycache
    
    ...
    
    var TinyCache = require( 'tinycache' );
    ...
    
#### By hand

    <script src="tinycache.min.js"></script>
    <script>
        var cache = new TinyCache();
        cache.put( 'foo', 'bar' );
    </script>

## API

### put = function(key, value, time)

* Simply stores a value. 
* If time isn't passed in, it is stored forever.
* Will actually remove the value in the specified time (via `setTimeout`)

### get = function(key)

* Retreives a value for a given key

### del = function(key)

* Deletes a key

### clear = function()

* Deletes all keys

### size = function()

* Returns the current number of entries in the cache

### memsize = function()

* Returns the number of entries taking up space in the cache
* Will usually `== size()` unless a `setTimeout` removal went wrong

### hits = function()

* Returns the number of cache hits

### misses = function()

* Returns the number of cache misses.

## TODO

* Namespaces
* A way of walking the cache for diagnostic purposes

## Note on Patches/Pull Requests
 
* Fork the project.
* Make your feature addition or bug fix.
* Send me a pull request.

## Thanks

Many thanks to Paul Tarjan for the first iteration of this library (https://github.com/ptarjan/node-cache).