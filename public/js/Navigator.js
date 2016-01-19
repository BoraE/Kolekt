define(['Button'], function(Button) {
    'use strict';

    function Navigator(app) {
        this.app = app;
        this.sendButton = new Button('#send');
        this.loginButton = new Button('#login');
        this.submitButton = new Button('#login_form input[type=button]');
        this.initialize();
    }

    Navigator.prototype.initialize = function() {
        this.sendButton.addEventListener('click', sendFiles.bind(this));
        this.loginButton.addEventListener('click', requestLogin.bind(this));
        this.submitButton.addEventListener('click', submitLogin.bind(this));
    };

    function submitLogin(e) {
        /* jshint validthis:true */
        // Fetch form data and send login information
        this.app.socket.emit('login', {
            username: document.querySelector('#username').value,
            password: document.querySelector('#password').value,
            remember: document.querySelector('input[name=remember]').checked
        });
        document.querySelector('#login_dialog').classList.add('hide');
        document.querySelector('#login_form').reset();
    }

    function requestLogin(e) {
        var loginDialog = document.querySelector('#login_dialog');
        loginDialog.classList.toggle('hide');
    }

    function sendFiles(e) {
        /* jshint validthis:true */
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = handleRequest;
        xhr.open('POST', '/data', true);
        xhr.send(this.app.getFormData());

        function handleRequest(e) {
            try {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status !== 200) {
                        alert('Image was not uploaded. Please retry.');
                    }
                }
            } catch(e) {
                alert('An error occurred. ' + e);
            }
        }
    }

    return Navigator;
});
