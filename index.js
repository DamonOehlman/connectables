var fs = require('fs'),
    path = require('path'),
    libPath = path.resolve(__dirname, 'lib');

fs.readdirSync(libPath).forEach(function(file) {
    exports[path.basename(file, '.js')] = require(path.join(libPath, file));
});