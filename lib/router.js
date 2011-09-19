var reOptionalSection = /\?$/,
    reParameter = /^\:(.*?)\??$/;

/* helper functions */

function genRule(path) {
    // if the path already is a regex then send it back
    if (path instanceof RegExp) {
        return {
            regex: path
        };
    } // if
    
    // tokenize the path
    var pathParts = (path || '').split('/').slice(1),
        regexString = '',
        optional,
        params = [];
    
    pathParts.forEach(function(part) {
        optional = reOptionalSection.test(part);
        regexString += '\/' + (optional ? '?' : '');
        
        if (reParameter.test(part)) {
            regexString += '(.*?)';
            params.push(part.replace(reParameter, '$1'));
        }
        else if (part) {
            regexString += '(?:' + part.replace(reOptionalSection, '') + ')';
        } // if..else
        
        if (optional) {
            regexString += '?';
        } // if
    });
    
    return {
        regex: new RegExp('^' + regexString + '$', 'i'),
        params: params
    }; 
} // genRegex


/* Router prototype */

function Router() {
    this.registry = [];
} // Router

Router.prototype.matches = function(req) {
    var matches = [];
    
    // look through the registry for a matching request
    this.registry.forEach(function(rule) {
        // perform regex matches using test as its a bit faster than exec
        // (according to benchmarks on jsperf.com: http://jsperf.com/test-vs-exec)
        if (rule.regex && rule.regex.test(req.url)) {
            matches[matches.length] = rule;
        }
    });
    
    return matches;
};

Router.prototype.add = function(path, handler, method) {
    var rule = genRule(path);
    
    // add the handler and method information
    rule.handler = handler;
    rule.method = (method || '').toUpperCase();
    
    // add to the registry
    this.registry.push(rule);
    
    /*
    console.log('path (' + path + ') regex: ', pathRegex);
    console.log('registering route', arguments);
    */
}; // add

['get', 'put', 'post', 'delete', 'head'].forEach(function(method) {
    Router.prototype[method] = function(path, handler) {
        return this.add(path, handler, method);
    };
});

/* exports */

module.exports = function(routerInitFn) {
    // create the router
    var router = new Router();
    
    // call the router initialization function
    if (routerInitFn) {
        routerInitFn(router);
    } // if
    
    return routerInitFn ? function(req, res, next) {
        var rule = router.matches(req)[0],
            match,
            params = {};
        
        // if we have a rule, then go about preparing adding valid params
        if (rule && rule.handler) {
            // if the rule has parameters then extract those from the url
            if (rule.params) {
                // now do a regex exec to get the results
                match = rule.regex.exec(req.url);

                // push the matches to the params array
                for (var ii = rule.params.length; ii--; ) {
                    params[rule.params[ii]] = match[ii + 1] || '';
                } // for
            } // if
            
            // initialise the params
            req.params = params;
            
            // now execute the handler
            rule.handler.call(router, req, res, next);
        } // if
    } : router;
};