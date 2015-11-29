module.exports = Server;

var express = require('express');
var http = require('http');
var fs = require('./form-serializer');

function Server(opts) {
    // Can call as Server() or new Server()
    if (!(this instanceof Server)) {
        return new Server(opts);
    }
    opts = opts || {};
    this.port = opts.port || 8080;
    this.startServer();
}

Server.prototype.startServer = function() {
    var app = express();
    var server = http.Server(app);
    var self = this;

    server.listen(this.port, function() {
        console.log('Server listening at port %d.', self.port);
    });

    // Handle POST requests
    app.post("/data", function(req, res) {
        var form = new fs();
        form.on('complete', function(status) {
            res.status(status).send('OK');
        });
        form.on('error', function(status, message) {
            console.log(message);
            res.status(status).send('Error');
        });
        form.serialize(req);
    });
    
    // Serve static files from public directory
    app.use(express.static(__dirname + '/../public/'));
};
