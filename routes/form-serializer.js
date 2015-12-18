'use strict'

const events = require('events');
const fs = require('fs');
const multiparty = require('multiparty');

class FormSerializer {
    constructor(opts) {
        opts = opts || {};
        this.uploadDir = opts.uploadDir || '../Kolekt-data';
        this.dataFile = opts.dataFile || 'kollect-data.json';
        this.emitter = new events.EventEmitter();
    }

    on(event, listener) {
        this.emitter.on(event, listener);
    }

    emit(event, data) {
        this.emitter.emit(event, data);
    }

    serialize(request) {
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
            var suffix = ',\n';
            var filePath = self.uploadDir+'/'+self.dataFile;
            fs.appendFile(filePath, JSON.stringify(data)+suffix, function(err) {
                if (err) {
                    Console.log('Could not store for data', data);
                    throw err;
                }
                console.log('Stored form data', data);
                self.emit('complete', 200);
            });
        });

        form.parse(request);
    }
}

module.exports = FormSerializer;
