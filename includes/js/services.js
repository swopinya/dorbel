/**
 * Created by swisa on 09/10/2015.
 */

var app = angular.module('dorbelApp.services', []);

app.service('my_map', function($rootScope){

    var apartments = [];

    this.set_apartments = function(items){
        apartments = items;
        $rootScope.$broadcast('apartmentsCount', apartments.length);
    };

    this.get_apartments = function(){
        return apartments;
    };

});