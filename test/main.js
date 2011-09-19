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
        
        router.get('/docs/:doc', function(req, res, next) {
            res.end('You asked for the doc: ' + req.params.doc);
        });
        
        router.get('/test/subpath?', sayHello);
        router.get('', sayHello);
        router.get('/paramtest/:param?', sayHello);
    })
);

server.listen(3000);