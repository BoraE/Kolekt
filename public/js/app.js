define(['form-navigator', 'Button', 'PhotosController'], function(FormNavigator, Button, PhotosController) {

    var sendButton;
    var loginButton;
    var deleteButton;
    var photosController;

    function initialize() {
        console.log('Loading app.js...');
        sendButton = new Button('#send');
        loginButton = new Button('#login');
        deleteButton = new Button('#delete');

        setup();
        setup2();
    }

    function setup() {
        photosController = new PhotosController('#section_photos');

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
    }

    function setup2() {
        var fn = new FormNavigator();
        fn.placeAt('#navigation');

        sendButton.addEventListener('click', sendFiles);
        deleteButton.addEventListener('click', photosController.removeSelectedImages);
        loginButton.setEnabled(false);
        deleteButton.setEnabled(false);
    }

    function sendFiles(e) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = handleRequest;
        xhr.open('POST', '/data', true);
        xhr.send(getFormData());

        function handleRequest() {
            try {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status !== 200) {
                        alert('Image was not uploaded. Please retry.');
                    }
                }
            } catch(e) {
                alert('An error occurred. ' + e.description);
            }
        }
    }

    // Construct form data to be sent over to the server
    function getFormData() {
        var form = document.querySelector('form');
        var formData = new FormData(form);
        var files = photosController.getImageFiles();

        Array.prototype.forEach.call(files, function(file) {
            console.log(file);
            formData.append(file.name, file);
        });
        return formData;
    }

    return {initialize: initialize};
});
