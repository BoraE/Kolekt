'use strict';

const events = require('events');

class LoginService {
    constructor() {
        this.emitter = new events.EventEmitter();
        this.hash = null;
    }

    login() {
    }

    logout() {
    }

    getUserData(username) {
        // Get user data from database for a matching user name
        let userData = this.hash.find( (userInfo) => {
            if (username === userInfo.username) {
                return true;
            }
        });
        return userData;
    }

    hashPassword(userData, password) {
        // Return hash value for password + salt for a given user
        return password + userData.salt; // Not a true salted hash function
    }

    on(event, listener) {
        this.emitter.on(event, listener);
    }

    emit(event, data) {
        this.emitter.emit(event, data);
    }
}

module.exports = LoginService;
