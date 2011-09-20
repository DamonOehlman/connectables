/**
Wrapper is inspired by [Quip](https://github.com/caolan/quip), but works differently
to avoid having all those function calls for each request that comes through...

It's a work in progress...
*/

module.exports = function(defaults) {
    defaults = defaults || {};
    defaults.contentType = defaults.contentType || 'text/html';
    defaults.statusCode = 200;
    
    // define the response object patches
    var reContentLength = /^Content\-Length$/i,
        baseHeaders = {
            'Content-Type': defaults.contentType
        }, 
        resPatches = {
            done: function(content, statusCode, headers) {
                var headerName,
                    haveContentLength = false;
                    
                // ensure we have at least an empty string for content
                content = content || '';

                // initialise the default status
                statusCode = statusCode || defaults.statusCode;

                // initialise options to empty defaults
                headers = headers || {};
            
                // TODO: support trailers
            
                // ensure we have the base headers
                for (headerName in baseHeaders) {
                    haveContentLength = haveContentLength || reContentLength.test(headerName);
                    
                    if (! headers[headerName]) {
                        headers[headerName] = baseHeaders[headerName];
                    } // if
                } // for
                
                // add the content length if not defined
                if (! haveContentLength) {
                    headers['Content-Length'] = content.length;
                }
            
                // add the headers
                this.writeHead(statusCode, headers);
                this.end(content);
            }
        };
    
    return function(req, res, next) {
        // patch the response
        for (var key in resPatches) {
            if (! res.hasOwnProperty(key)) {
                res[key] = resPatches[key];
            } // if
        } // for
        
        // execute the next handler
        next();
    };
};