'use strict';

const express = require('express');
const FormSerializer = require('./FormSerializer');
const LoginService = require('./LoginService');
const http = require('http');

class Server {
    constructor(opts) {
        opts = opts || {};
        this.port = opts.port || 8080;
        this.startServer();
        this.loginService = new LoginService();
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
            let form = new FormSerializer();
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

        // Wait for socket connections
        io.on('connection', function (socket) {
            console.log('Socket connection established.');

            socket.on('login', function (data) {
                console.log(data);
                self.loginService.login(data, socket);
            });

            socket.on('logout', function (data) {
                console.log(data);
                self.loginService.logout(data, socket);
            });

            socket.on('disconnect', function () {
                console.log('Socket disconnected.');
                io.emit('user disconnected');
            });
        });
    }
}

module.exports = Server;
