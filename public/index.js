var map;
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: {lat:42.352741, lng:-71.121343}
    });
    
    var marker = new google.maps.Marker({
        position: {lat:42.352741, lng:-71.121343},
        title:"Current position"
    });
    marker.setMap(map);
}

(function() {
    var files = [];
    
    window.onload = function() {
        var view = document.querySelector('#view');
        var add = document.querySelector('#add');
        var del = document.querySelector('#del');

        var input = document.querySelector('input[type=file]');
        var send = document.querySelector('#send');

        add.addEventListener('click', function(e) {input.click();}, false);
        input.addEventListener('change', handleFiles, false);
        send.addEventListener('click', sendFiles, false);
        view.addEventListener('click', function(e) {
            var map = document.getElementById('map');
            var images = document.querySelector('.images');
            map.classList.toggle('hide');
            images.classList.toggle('hide');
            e.target.textContent = (e.target.textContent==='Map')?'Photos':'Map';
            if (e.target.textContent === 'Photos') {
                initMap();
            }
        });
        
        function sendFiles(e) {
            var form = document.querySelector('form');
            var formData = new FormData(form);

            files.forEach(function(file) {
                console.log(file);
                formData.append(file.name, file);
            });
            
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = handleRequest;
            xhr.open('POST', '/data', true);
            xhr.send(formData);
            
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
            var images = document.querySelector('.images');
            
            if (file.type.search('image/*') == -1) {
                alert("Selected file is not an image.");
                return;
            }
            
            var reader = new FileReader();
            reader.onload = function(e) {
                var img = document.createElement('img');
                img.src = e.target.result;
                images.appendChild(img);
                img.addEventListener('click', function(e) {
                    e.target.classList.toggle('selected');
                });
                files.push(file);
            };
            reader.onerror = function() {
                alert("Image did not load.");
            };
            reader.readAsDataURL(file);
        }
    };
}());
