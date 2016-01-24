'use strict';

const express = require('express');
const FS = require('./form-serializer');
const http = require('http');

class Server {
    constructor(opts) {
        opts = opts || {};
        this.port = opts.port || 8080;
        this.startServer();
    }

    startServer() {
        var app = express();
        var server = http.Server(app);
        var io = require('socket.io')(server);

        var self = this;

        server.listen(this.port, function() {
            console.log('Server listening at port %d.', self.port);
        });

        // Handle POST requests
        app.post("/data", function(req, res) {
            var form = new FS();
            form.on('complete', function(status) {
                res.status(status).send('OK');
            });
            form.on('error', function(err) {
                console.log(err);
                if (err.statusCode) {
                    res.status(err.statusCode).send('Error');
                } else {
                    res.status('505').send('Unknown error');
                }
            });
            form.serialize(req);
        });

        // Serve static files from public directory
        app.use(express.static(__dirname + '/../public/'));

        // Wait for socket connection
        io.on('connection', function (socket) {
            console.log('Socket connection established.');
            socket.on('login', function (data) {
                console.log(data);
                if (data.username && data.password) { // Need real login validation here from login-service.js
                    socket.emit('loginResponse', {username: data.username, token:'dad53sdfsdf'});
                } else {
                    socket.emit('loginResponse', {error: 'Invalid username or password.'});
                }
            });

            socket.on('logout', function (data) {
                console.log(data);
                socket.emit('loginResponse', {error: 'User logged out.'});
            });

            socket.on('disconnect', function () {
                console.log('Socket disconnected.');
                io.emit('user disconnected');
            });
        });
    }
}

module.exports = Server;
