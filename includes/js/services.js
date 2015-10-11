/**
 * Created by swisa on 09/10/2015.
 */

var app = angular.module('dorbelApp.services', []);

app.service('my_map', function(){

    var apartments = [];

    this.set_apartments = function(items){
        apartments = items;
    };

    this.get_apartments = function(){
        return apartments;
    };

});