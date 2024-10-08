# connectables

Middleware extras for the excellent [connect](https://github.com/senchalabs/connect) Node.js middleware layer.

## Overview

This project exists, because particular parts of the connect middleware started to be [removed from the project](https://github.com/senchalabs/connect/issues/262).  While I agree that Connect should be as light as possible, I really don't need some of the functionality that [Express](https://github.com/visionmedia/express) provides and really, really like connect.

So this project aims to provide a router compatible with the previous connect router middleware, which is [Sinatra](http://www.sinatrarb.com/intro)-like in its route definition and behaviour.  Additionally, I expect that some additional [rack](http://rack.rubyforge.org/)-like middleware will also make an appearance...

## Using the Router

Initializing the router is quite simple and uses the same general approach that the original connect router did, for instance,

```js
var server = connect.createServer(
    connect.logger(),
    
    connectables.router(function(router) {
        router.get('/', function(req, res, next) {
            res.end('Hi');
        });
    })
);
```

is an example of a simple route registration, which if you are familiar with the existing connect router should look pretty much exactly the same.

### RESTful URL parameters

If you are keen to use RESTful urls to drive your web application, then you can register urls that act as parameter values:

```js
var server = connect.createServer(
    connect.logger(),
    
    connectables.router(function(router) {
        router.get('/doc/:id', function(req, res, next) {
            res.end('You asked for doc id: ' + req.params.id);
        });
    })
);
```

### Optional Parameters

Using similar code to what is shown above, you can make parameterized urls with optional parameters:

```js
var server = connect.createServer(
    connect.logger(),
    
    connectables.router(function(router) {
        router.get('/docs/:category?', function(req, res, next) {
            if (! req.params.category) {
                res.end('No category specified, guess I should list all the docs');
            }
            else {
                res.end('You asked for the doc category: ' + req.params.category);
            }
        });
    })
);
```

### Wildcard Sections

In similar fashion to Sinatra routes, the connectables router supports wildcards:

```js
var server = connect.createServer(
    connect.logger(),
    
    connectables.router(function(router) {
        router.get('/the/*/*/on/the/*', function(req, res, next) {
            var splat = req.params['*'],
                phrase = 'the ' + (splat[0] || '') + ' ' + 
                    (splat[1] || '') + ' ' + 
                    'on the ' + (splat[2] || '');
            
            res.end(phrase);
        });
    })
);
```
Having a look at the code above, you can probably see that the multiple wildcard parameter
matches are added to the `*` parameter values.  You will also see that in the case above the parameter values are passed back as an array rather than a single value.  This is the default behaviour when multiple parameters with the same name are encountered.

## Query Parameter Handling

The connectables router patches the request object to supply query string parameters as an object literal.  This might be duplication with core connect and/or node functionality and this is being investigated...

## Alternative Initialization

An alternative way to use the router and define / remove the routes is to initialize the router without providing the callback function:

```js
var connectables = require('connectables'),
	router = connectables.router();
```

Initializing the router in this way returns the the router instance instead of the request handler function.  You can then reference use this router instance to programmatically add and remove routes as required:

```js
router.get('/', function(req, res, next) {
	res.end('Hi again');
});
```

You do of course, still need to register the router as connect middleware though.  This is done by calling the `init` method of the router instance:

```js
var server = connect.createServer(
    connect.logger(),
    router.init()
);
```

## License(s)

### MIT

Copyright (c) 2011 Damon Oehlman <damon.oehlman@gmail.com>

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