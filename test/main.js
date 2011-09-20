var connect = require('connect'),
    connectables = require('../');
    
function sayHello(req, res, next) {
    res.end('hello: ' + req.params.param);
} // sayHello
    
var server = connect.createServer(
    connect.logger(),
    
    connectables.router(function(router) {
        router.get('/', function(req, res, next) {
            res.end('Hi');
        });
        
        router.get('/docs/:category?', function(req, res, next) {
            if (! req.params.category) {
                res.end('No category specified, guess I should list all the docs');
            }
            else {
                res.end('You asked for the doc category: ' + req.params.category);
            }
        });
        
        router.get('/doc/:id', function(req, res, next) {
            res.end('You asked for doc id: ' + req.params.id);
        });
        
        router.get('/test/subpath?', sayHello);
        router.get('', sayHello);
        router.get('/paramtest/:param?', sayHello);
    })
);

server.listen(3000);