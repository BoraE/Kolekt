define(['form-navigator'], function(FormNavigator) {
    function initialize() {
        console.log('Loading app.js...');
        // setup();
        setup2();
    }

    function setup() {
        var photo_title = document.querySelector('#photos > .section_title');
        var map_title = document.querySelector('#map > .section_title');
        var form_title = document.querySelector('#form > .section_title');

        photo_title.addEventListener("click", handlePhotoSection);

        map_title.addEventListener("click", function(e) {
            var map_content = document.querySelector('#map > .section_content');
            map_content.classList.toggle('hide');

        });

        form_title.addEventListener("click", function(e) {
            var form_content = document.querySelector('#form > .section_content');
            form_content.classList.toggle('hide');

        });
    }

    function handlePhotoSection(e) {
        var photo_content = document.querySelector('#photos > .section_content');
        photo_content.classList.toggle('hide');
    }

    function setup2() {
        var fn = new FormNavigator();
        fn.placeAt('#navigation');

        var camera = document.querySelector('#camera');
        var map = document.querySelector('#map');
        var add = document.querySelector('#add');
        var del = document.querySelector('#del');

        var input = document.querySelector('input[type=file]');
        var send = document.querySelector('#send');

        add.addEventListener('click', function(e) {input.click();}, false);
        del.addEventListener('click', function(e) {removeSelectedImages();} , false);
        input.addEventListener('change', handleFiles, false);

        send.addEventListener('click', sendFiles, false);
        map.addEventListener('click', function(e) {
            var location = document.getElementById('location');
            var images = document.querySelector('#images');
            location.classList.remove('hide');
            camera.classList.remove('hide');
            map.classList.add('hide');
            images.classList.add('hide');
        });
        camera.addEventListener('click', function(e) {
            var location = document.getElementById('location');
            var images = document.querySelector('#images');
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
        var images = document.querySelector('#images');

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
        var images = document.querySelectorAll('#images>img');
        Array.prototype.forEach.call(images, function(el) {
            var file = el.File;
            console.log(file);
            formData.append(file.name, file);
        });
        return formData;
    }

    // Add add to the top banner
    function addImageFromFile(url, file) {
        var container = document.getElementById('images');
        var el = document.createElement('img');
        el.src = url;
        el.File = file;
        el.addEventListener('click', function(e) {
            var selected;
            e.target.classList.toggle('selected');
            selected = container.querySelectorAll('img.selected');
            document.getElementById('del').disabled = (selected.length === 0);
        });
        container.appendChild(el);
        container.classList.remove('disabled');
    }

    // Remove selected images from the top banner
    function removeSelectedImages() {
        var container = document.getElementById('images');
        var images = container.querySelectorAll('img.selected');
        Array.prototype.forEach.call(images, function(el) {
            container.removeChild(el);
        });
        // If all images are removed bring back the information banner
        if (container.querySelectorAll('img').length === 0) {
            container.classList.add('disabled');
        }
        document.getElementById('del').disabled = true;
    }

    return {initialize: initialize};
});
