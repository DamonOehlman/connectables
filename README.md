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
        router.get('/docs/:doc', function(req, res, next) {
            res.end('You asked for the doc: ' + req.params.doc);
        });
    })
);
```

### Optional Parameters

To be completed

### Wildcard Sections

To be implemented.
