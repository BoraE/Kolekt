define(['Button'], function(Button) {
    'use strict';

    function PhotosController(el) {
        this.domNode = document.querySelector(el);
        this.title = this.domNode.querySelector('.section_title');
        this.content = this.domNode.querySelector('.section_content');
        this.addButton = new Button('#add_photo');

        this.initialize();
    }

    PhotosController.prototype.initialize = function() {
        var input = this.content.querySelector('input[type=file]');
        input.addEventListener('change', handleFiles.bind(this));

        this.addButton.addEventListener('click', function(e) {input.click();});
        this.title.addEventListener("click", handlePhotoSection.bind(this));
    };

    PhotosController.prototype.addImageFromFile = function(url, file) {
        var el = document.createElement('img');
        el.src = url;
        el.File = file;
        el.addEventListener('click', function(e) {
            e.target.classList.toggle('selected');
        });
        this.content.insertBefore(el, this.addButton.domNode);
    };

    PhotosController.prototype.removeSelectedImages = function(url, file) {
        var selected = this.content.querySelectorAll('img.selected');
        var self = this;
        Array.prototype.forEach.call(selected, function(el) {
            self.content.removeChild(el);
        });
    };

    PhotosController.prototype.getImageFiles = function() {
        var files = [];
        var images = this.content.querySelectorAll('img');
        Array.prototype.forEach.call(images, function(el) {
            files.push(el.File);
        });
        return files;
    };

    function handlePhotoSection(e) {
        /* jshint validthis:true */
        this.title.classList.toggle('collapsed');
        this.content.classList.toggle('hide');
    }

    function handleFiles(e) {
        /* jshint validthis:true */
        var file = e.target.files[0];
        if (file.type.search('image/*') == -1) {
            alert("Selected file is not an image.");
            return;
        }
        e.target.value = null; // To allow selecting the same image file again

        var reader = new FileReader();
        var self = this;
        reader.onload = function(e) {
            self.addImageFromFile(e.target.result, file);
        };
        reader.onerror = function() {
            alert("Could not load selected image.");
        };
        reader.readAsDataURL(file);
    }

    return PhotosController;
});
