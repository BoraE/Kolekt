'use strict';
const events = require('events');
const fs = require('fs');
const hashFile = "password_hash.js";

class LoginService {
    constructor() {
        this.emitter = new events.EventEmitter();
    }

    login(loginData, socket) {
        let self = this;
        fs.readFile(__dirname + "/" + hashFile, (err, hash) => {
            if (err) throw err;
            self.hash = JSON.parse(hash);

            // Validate login if userData is found for the given username
            let username = loginData.username;
            let userData = self.findUserData(username);
            if (userData && self.validatePasswordHash(userData, loginData)) {
                socket.emit('loginResponse', {username: username, token: self.generateToken(username)});
            } else {
                socket.emit('loginResponse', {username: username, error: 'Login failed.'});
            }
        });
    }

    logout(data, socket) {
        let username = data.username;
        let token = data.token;
        let userData = this.findUserData(data.username);
        if (userData && (token === this.generateToken(username))) {
            socket.emit('logoutResponse', {username: username, token: token, message: 'User logged out.'});
        } else {
            socket.emit('logoutResponse', {username: username, error: 'Logout failed.'});
        }
    }

    findUserData(username) {
        // Find user data in the hash file for a given username
        let userData = this.hash.find( (userInfo) => {
            if (username && (username === userInfo.username)) {
                return true;
            }
        });
        return userData;
    }

    validatePasswordHash(userData, loginData) {
        let password = loginData.password;
        return (password && (userData.hash === this.hashPassword(password, userData.salt)));
    }

    hashPassword(password, salt) {
        // Return hash value for password + salt for a given user
        return password + salt; // TODO: Generate a true salted hash.
    }

    generateToken(username) {
        return username + '_' + 'ds231%!#$rer2$rdt21%'; // TODO: Generate a real token.
    }

    on(event, listener) {
        this.emitter.on(event, listener);
    }

    emit(event, data) {
        this.emitter.emit(event, data);
    }
}

module.exports = LoginService;
