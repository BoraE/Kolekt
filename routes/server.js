'use strict';

const express = require('express');
const FormSerializer = require('./FormSerializer');
const http = require('http');
const fs = require('fs');

const hashFile = "password_hash.js";

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
            var form = new FormSerializer();
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
                self.validateUser(data, socket);
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

    validateUser(loginData, socket) {
        fs.readFile(__dirname + "/" + hashFile, (err, hash) => {
            if (err) throw err;
            hash = JSON.parse(hash);
            let userData = hash.find( (userInfo) => {
                if (loginData.username && (loginData.username === userInfo.username)) {
                    return true;
                }
            });
            if (userData && loginData.password && this.hashPassword(userData, loginData.password)) {
                socket.emit('loginResponse', {username: loginData.username, token:'dad53sdfsdf'});
            } else {
                socket.emit('loginResponse', {error: 'Invalid username or password.'});
            }
        });
    }

    hashPassword(userData, password) {
        return (userData.hash === (password + userData.salt));
    }
}

module.exports = Server;
