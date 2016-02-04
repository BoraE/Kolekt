define(['Button', 'FormController', 'PhotosController', 'MapController', 'Navigator'], function(Button, FormController, PhotosController, MapController, Navigator) {
    'use strict';

    function App() {
        this.initialize();
        this.startSocket();
    }

    App.prototype.startSocket = function() {
        this.socket = io.connect(window.location.host);
        console.log('Starting socket connection');
        this.socket.on('loginResponse', loginHandler.bind(this));
        this.socket.on('logoutResponse', logoutHandler.bind(this));
    };

    App.prototype.initialize = function() {
        console.log('Loading app.js...');

        this.formController = new FormController("#section_form");
        this.mapController = new MapController("#section_map");
        this.photosController = new PhotosController('#section_photos');
        this.navigator = new Navigator(this);
    };

    // Construct form data to be sent over to the server
    App.prototype.getFormData = function() {
        var form = document.querySelector('.form');
        var formData = new FormData(form);

        var files = this.photosController.getImageFiles();
        Array.prototype.forEach.call(files, function(file) {
            console.log(file);
            formData.append(file.name, file);
        });
        if (this.navigator.getUserName()) {
            formData.append('username', this.navigator.getUserName());
        }
        return formData;
    };

    function loginHandler(data) {
        /* jshint validthis:true */
        console.log('Login authorization data:', data);
        if (data.error) {
            this.navigator.setSubmitEnabled(false);
            this.navigator.setLoginMode('login');
            alert(data.error);
        } else {
            // Save token if valid data. You are now logged in.
            // Use token with every server communication.
            this.navigator.saveUserToken(data);
            this.navigator.setSubmitEnabled(true);
            this.navigator.setLoginMode('logout');
        }
    }

    function logoutHandler(data) {
        /* jshint validthis:true */
        console.log('Logout authorization data:', data);
        if (data.error) {
            this.navigator.setSubmitEnabled(false);
            this.navigator.setLoginMode('logout');
            alert(data.error);
        } else {
            // You are now logged out.
            this.navigator.setSubmitEnabled(false);
            this.navigator.setLoginMode('login');
            alert(data.message);
        }
    }

    return App;
});
