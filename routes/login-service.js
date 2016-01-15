'use strict';

const events = require('events');

class LoginService {
    constructor() {
        this.emitter = new events.EventEmitter();
    }

    login(data) {
        var username = data.username;
        var password = data.password;
        var userdata = this.getUserData(username);
        if (userdata !== null) {
            if (this.hash(password+userdata.salt) === userdata.hash) {
            } else {
                this.emit('error', 'Invalid username or password');
            }
        } else {
            this.emit('error', 'Invalid username or password');
        }
    }

    getUserData(username) {
        // Get user data from database
        return {username:'', salt:'asd123d@1'};
    }

    hash(str) {
        // Return hash value for password+salt
        return 'dadas4543rw@3232fr!';
    }

    on(event, listener) {
        this.emitter.on(event, listener);
    }

    emit(event, data) {
        this.emitter.emit(event, data);
    }
}

module.exports = LoginService;
