define(['Button'], function(Button) {
    'use strict';

    function Navigator(app) {
        this.app = app;
        this.sendButton = new Button('#send');
        this.loginButton = new Button('#login');
        this.initialize();
    }

    Navigator.prototype.initialize = function() {
        this.sendButton.addEventListener('click', sendFiles.bind(this));
        this.loginButton.addEventListener('click', requestLogin.bind(this));
    };

    function requestLogin(e) {
        var loginDialog = document.querySelector('#login_dialog');
        loginDialog.classList.toggle('hide');
    }

    function sendFiles(e) {
        /*jshint validthis:true */
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
