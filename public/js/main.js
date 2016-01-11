require.config({
    paths: {},
    urlArgs: "bust=" + (new Date()).getTime()
});

require(['App'], function(App) {
    console.log('Initializing the app...');
    var app = new App();
});
