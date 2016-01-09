define([], function() {
    'use strict';

    function Button(el) {
        this.domNode = document.querySelector(el);
    }

    Button.prototype.setEnabled = function(enabled) {
        if (enabled) {
            this.domNode.classList.remove('disabled');
        } else {
            this.domNode.classList.add('disabled');
        }
    };

    Button.prototype.addEventListener = function(eventName, callback) {
        this.domNode.addEventListener(eventName, callback, false);
    };

    return Button;
});
