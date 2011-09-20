var connect = require('connect'),
    connectables = require('../');
    
function sayHello(req, res, next) {
    res.end('hello: ' + req.params.param);
} // sayHello
    
var server = connect.createServer(
    connect.logger(),
    connectables.wrapper(),
    
    connectables.router(function(router) {
        router.get('/', function(req, res, next) {
            res.done('Hi');
        });
    })
);

server.listen(3000);