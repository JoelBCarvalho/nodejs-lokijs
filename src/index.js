var config = require('./config');
var server = require('./server');

module.exports = function() {
    server.start(config);
};
