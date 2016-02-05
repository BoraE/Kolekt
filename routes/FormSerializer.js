'use strict';
const events = require('events');
const fs = require('fs');
const multiparty = require('multiparty');

class FormSerializer extends events.EventEmitter {
    constructor(opts) {
        super();
        opts = opts || {};
        this.uploadDir = opts.uploadDir || '../Kolekt-data';
        this.dataFile = opts.dataFile || 'kollect-data.json';
    }

    serialize(request) {
        let form = new multiparty.Form({ uploadDir:this.uploadDir });
        let data = { timestamp: new Date().toISOString() };
        let self = this;

        form.on('field', (name, value) => {
            data[name] = data[name] || [];
            data[name].push(value);
        });

        form.on('file', (name, file) => {
            data.files = data.files || [];
            data.files.push(file.path);
        });

        form.on('error', (err) => {
            this.emit('error', err);
        });

        form.on('close', function() {
            var suffix = ',\n';
            var filePath = self.uploadDir + '/' + self.dataFile;
            fs.appendFile(filePath, JSON.stringify(data) + suffix, (err) => {
                if (err) {
                    console.log('Could not store form data', data);
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
