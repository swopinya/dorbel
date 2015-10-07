/**
 * Created by Shimon on 07/10/2015.
 */
var app = angular.module('dorbelApp.controllers', []);
var base_url = 'http://localhost:3000';
app.controller('ListCtrl', function($scope, $http){

    $http.get(base_url + '/apartments-list').then(
        function success(res){
            console.log(res.data);
            $scope.apartments = res.data;
        },
        function error(res){
            console.log(res);
        }
    );

});
