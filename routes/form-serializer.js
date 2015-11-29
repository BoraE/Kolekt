module.exports = FormSerializer;

var events = require('events');
var fs = require('fs');
var multiparty = require('multiparty');

function FormSerializer(opts) {
    // Can call as FormSerializer() or new FormSerializer()
    if (!(this instanceof FormSerializer)) {
        return new FormSerializer(opts);
    }
    opts = opts || {};
    this.uploadDir = opts.uploadDir || '../Kolekt-data';
    this.emitter = new events.EventEmitter();
}

FormSerializer.prototype.serialize = function(request) {
    var form = new multiparty.Form({uploadDir:this.uploadDir});
    var data = {};
    var self = this;
       
    form.on('field', function(name, value) {
        if (data[name] === undefined) {
            data[name] = [];
        }
        data[name].push(value);
    });
    
    form.on('file', function(name, file) {
        if (data['files'] === undefined) {
            data['files'] = [];
        }
        data['files'].push(file.path)
    });
    
    form.on('error', function(err) {
        self.emit('error', err.statusCode);
    });

    form.on('close', function() {
        // console.log('Stored form data', JSON.stringify(data));
        console.log('Stored form data', data);
        self.emit('complete', 200);
    });

    form.parse(request);
};

FormSerializer.prototype.on = function(event, listener) {
    this.emitter.on(event, listener);
};

FormSerializer.prototype.emit = function(event, data) {
    this.emitter.emit(event, data);
};
