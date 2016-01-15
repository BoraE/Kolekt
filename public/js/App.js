define(['form-navigator', 'Button', 'PhotosController', 'Navigator'], function(FormNavigator, Button, PhotosController, Navigator) {
    'use strict';

    function App() {
        this.startSocket();
        this.initialize();
    }

    App.prototype.startSocket = function() {
        this.socket = io.connect(window.location.host);
        console.log('Starting socket connection');
        this.socket.on('loginResponse', function (data) {
            console.log('Authorization data:', data);
            // Save token if valid data. You are now logged in.
            // Use token with every server communication.
        });
    };

    App.prototype.initialize = function() {
        console.log('Loading app.js...');
        this.deleteButton = new Button('#delete');

        var fn = new FormNavigator();
        fn.placeAt('#navigation');

        this.photosController = new PhotosController('#section_photos');
        this.navigator = new Navigator(this);

        var self = this;
        this.loginSubmitButton =document.querySelector('#login_form input[type=button]');
        this.loginSubmitButton.addEventListener('click', function(e) {
            // Fetch form data and send login information
            self.socket.emit('login', {
                username: document.querySelector('#username').value,
                password: document.querySelector('#password').value,
                remember: document.querySelector('input[name=remember]').checked
            });
        });

        var map_title = document.querySelector('#section_map > .section_title');
        var form_title = document.querySelector('#section_form > .section_title');

        map_title.addEventListener("click", function(e) {
            var map_content = document.querySelector('#section_map > .section_content');
            map_content.classList.toggle('hide');
            map_title.classList.toggle('collapsed');
        });

        form_title.addEventListener("click", function(e) {
            var form_content = document.querySelector('#section_form > .section_content');
            form_content.classList.toggle('hide');
            form_title.classList.toggle('collapsed');
        });

        this.deleteButton.addEventListener('click', this.photosController.removeSelectedImages);
        this.deleteButton.setEnabled(false);
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
        return formData;
    };

    return App;
});
