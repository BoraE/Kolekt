define([], function() {
    'use strict';

    function FormNavigator(state) {
        this.setState(state || {});
    }

    FormNavigator.prototype.placeAt = function(parent) {
        this.parent = document.querySelector(parent);
    };

    FormNavigator.prototype.setState = function(state) {
        this.state = state;
    };

    FormNavigator.prototype.getState = function() {
        return this.state;
    };

    FormNavigator.prototype.on = function(event, listener) {
    };

    FormNavigator.prototype.emit = function(event, data) {
    };

    return FormNavigator;
});
