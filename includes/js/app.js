/**
 * Created by Shimon on 07/10/2015.
 */
var app = angular.module('dorbelApp', [
    'ui.router',
    'dorbelApp.controllers'
]);

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/browse');

    $stateProvider

        .state('browse', {
            url: '/browse',
            templateUrl: 'templates/browse.html'
        })

});