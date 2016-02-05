'use strict';
const events = require('events');
const fs = require('fs');

class LoginService extends events.EventEmitter {
    constructor(opts) {
        super();
        opts = opts || {};
        this.hashFile = opts.hashFile || "password_hash.js";
    }

    login(loginData, socket) {
        let self = this;
        fs.readFile(__dirname + "/" + this.hashFile, (err, hash) => {
            if (err) throw err;
            self.hash = JSON.parse(hash);

            // Validate login if userData is found for the given username
            let username = loginData.username;
            let userData = self.findUserData(username);
            let responseData;
            if (userData && self.validatePasswordHash(userData, loginData)) {
                responseData = {username: username, token: self.generateToken(username)};
            } else {
                responseData = {username: username, error: 'Login failed.'};
            }
            socket.emit('loginResponse', responseData);
        });
    }

    logout(data, socket) {
        let token = data.token;
        let username = data.username;
        let userData = this.findUserData(data.username);
        let responseData;
        if (userData && (token === this.generateToken(username))) {
            responseData = {username: username, token: token, message: 'User logged out.'};
        } else {
            responseData = {username: username, error: 'Logout failed.'};
        }
        socket.emit('logoutResponse', responseData);
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
}

module.exports = LoginService;
