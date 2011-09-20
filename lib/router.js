var querystring = require('querystring'),
    reOptionalSection = /\?$/,
    reParameter = /^\:(.*?)\??$/,
    reWildcard = /\*/;

/* helper functions */

function genMethodRegex(method) {
    if (method instanceof RegExp) {
        return method;
    } // if
    
    if (typeof method == 'string') {
        return new RegExp('^' + method + '$', 'i');
    } // if
} // genMethodRegex

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
        else if (reWildcard.test(part)) {
            regexString += '(' + part.replace(reWildcard, '.*?') + ')';
            params.push('*');
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
    var matches = [],
        urlParts = (req.url || '').split('?'),
        url = urlParts[0] || '';
        
    // add the query params to the request
    req.queryParams = querystring.parse(urlParts[1] || '');
    
    // look through the registry for a matching request
    this.registry.forEach(function(rule) {
        // perform regex matches using test as its a bit faster than exec
        // (according to benchmarks on jsperf.com: http://jsperf.com/test-vs-exec)
        var matchOK = rule.regex && rule.regex.test(url) && 
             ((! rule.method) || rule.method.test(req.method));
        
        if (matchOK) {
            matches[matches.length] = rule;
        }
    });
    
    return matches;
};

Router.prototype.add = function(path, handler, method) {
    var rule = genRule(path);
    
    // add the handler and method information
    rule.handler = handler;
    rule.method = genMethodRegex(method);
    
    // add to the registry
    this.registry.push(rule);
}; // add

Router.prototype.init = function() {
    var router = this;
    
    return function(req, res, next) {
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
                for (var ii = 0, matchCount = rule.params.length; ii < matchCount; ii++) {
                    // get the current parameter value
                    var paramValue = params[rule.params[ii]];
                    
                    // if we already have a value, then convert into an array of values
                    if (typeof paramValue != 'undefined') {
                        paramValue = [].concat(paramValue).concat(match[ii + 1] || '');
                    }
                    // otherwise, just get the match value
                    else {
                        paramValue = match[ii + 1] || '';
                    } // if..else
                    
                    // update the parameter value
                    params[rule.params[ii]] = paramValue;
                } // for
            } // if
        
            // patch the parameters into the request
            req.params = params;
        
            // now execute the handler
            rule.handler.call(router, req, res, next);
        } // if
    };
}; // handleRequest

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
    
    return routerInitFn ? router.init() : router;
};