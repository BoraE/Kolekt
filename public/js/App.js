define(['form-navigator', 'Button', 'PhotosController', 'MapController', 'Navigator'], function(FormNavigator, Button, PhotosController, MapController, Navigator) {
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
            if (data.error) {
                alert(data.error);
            } else {
                // Save token if valid data. You are now logged in.
                // Use token with every server communication.
            }
        });
    };

    App.prototype.initialize = function() {
        console.log('Loading app.js...');
        this.deleteButton = new Button('#delete');

        this.formController = new FormNavigator("#section_form");
        this.mapController = new MapController("#section_map");
        this.photosController = new PhotosController('#section_photos');
        this.navigator = new Navigator(this);

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
