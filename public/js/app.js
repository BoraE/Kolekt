define(['form-navigator', 'Button'], function(FormNavigator, Button) {

    var sendButton;
    var loginButton;
    var deleteButton;

    function initialize() {
        console.log('Loading app.js...');
        sendButton = new Button('#send');
        loginButton = new Button('#login');
        deleteButton = new Button('#delete');

        setup();
        setup2();
    }

    function setup() {
        var photo_title = document.querySelector('#section_photos > .section_title');
        //var map_title = document.querySelector('#map > .section_title');
        var form_title = document.querySelector('#section_form > .section_title');

        photo_title.addEventListener("click", handlePhotoSection);

        // map_title.addEventListener("click", function(e) {
        //     var map_content = document.querySelector('#map > .section_content');
        //     map_content.classList.toggle('hide');

        // });

        form_title.addEventListener("click", function(e) {
            var form_content = document.querySelector('#section_form > .section_content');
            form_content.classList.toggle('hide');

        });
    }

    function handlePhotoSection(e) {
        var photo_content = document.querySelector('#section_photos > .section_content');
        photo_content.classList.toggle('hide');
    }

    function setup2() {
        var fn = new FormNavigator();
        fn.placeAt('#navigation');

        var camera = document.querySelector('#camera');
        var map = document.querySelector('#map');
        var add = document.querySelector('#add');

        var input = document.querySelector('input[type=file]');

        add.addEventListener('click', function(e) {input.click();}, false);
        input.addEventListener('change', handleFiles, false);

        sendButton.addEventListener('click', sendFiles);
        deleteButton.addEventListener('click', removeSelectedImages);
        loginButton.setEnabled(false);
        deleteButton.setEnabled(false);

        map.addEventListener('click', function(e) {
            var location = document.getElementById('location');
            var images = document.querySelector('#section_photos > .section_content');
            location.classList.remove('hide');
            camera.classList.remove('hide');
            map.classList.add('hide');
            images.classList.add('hide');
        });
        camera.addEventListener('click', function(e) {
            var location = document.getElementById('location');
            var images = document.querySelector('#section_photos > .section_content');
            location.classList.add('hide');
            camera.classList.add('hide');
            map.classList.remove('hide');
            images.classList.remove('hide');
        });
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

    function handleFiles(e) {
        var file = e.target.files[0];
        if (file.type.search('image/*') == -1) {
            alert("Selected file is not an image.");
            return;
        }
        var images = document.querySelector('#section_photos > .section_content');

        var reader = new FileReader();
        reader.onload = function(e) {
            addImageFromFile(e.target.result, file);
        };
        reader.onerror = function() {
            alert("Image did not load.");
        };
        reader.readAsDataURL(file);
    }

    // Construct form data to be sent over to the server
    function getFormData() {
        var form = document.querySelector('form');
        var formData = new FormData(form);
        var images = document.querySelectorAll('#section_photos .section_content > img');

        Array.prototype.forEach.call(images, function(el) {
            var file = el.File;
            console.log(file);
            formData.append(file.name, file);
        });
        return formData;
    }

    // Add add to the top banner
    function addImageFromFile(url, file) {
        var container = document.querySelector('#section_photos > .section_content');
        var el = document.createElement('img');
        el.src = url;
        el.File = file;
        el.addEventListener('click', function(e) {
            var selected;
            e.target.classList.toggle('selected');
            selected = container.querySelectorAll('img.selected');
            deleteButton.setEnabled(selected.length > 0);
        });
        container.appendChild(el);
        container.classList.remove('disabled');
    }

    // Remove selected images from the top banner
    function removeSelectedImages() {
        var container = document.querySelector('#section_photos > .section_content');
        var images = container.querySelectorAll('img.selected');
        Array.prototype.forEach.call(images, function(el) {
            container.removeChild(el);
        });
        // If all images are removed bring back the information banner
        if (container.querySelectorAll('img').length === 0) {
            container.classList.add('disabled');
        }
        deleteButton.setEnabled(false);
    }

    return {initialize: initialize};
});
