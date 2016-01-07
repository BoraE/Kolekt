require.config({
    paths: {},
    urlArgs: "bust=" + (new Date()).getTime()
});

require(['app'], function(App) {
    console.log('Initializing the app...');
    App.initialize();
});
