var connect = require('connect'),
    connectables = require('../');
    
function sayHello(req, res, next) {
    res.end('hello: ' + req.params.param);
} // sayHello
    
var server = connect.createServer(
    connect.logger(),
    
    connectables.router(function(router) {
        router.get('/', sayHello);
        router.get('/test/subpath?', sayHello);
        router.get('', sayHello);
        router.get('/paramtest/:param?', sayHello);
    })
);

server.listen(3000);