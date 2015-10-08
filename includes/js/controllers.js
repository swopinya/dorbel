/**
 * Created by Shimon on 07/10/2015.
 */
var app = angular.module('dorbelApp.controllers', []);
var base_url = 'http://localhost:3000';


app.controller('ListCtrl', function($scope, $http){

    $http.get(base_url + '/apartments-list').then(
        function success(res){
            console.log(res.data[0].image);
            $scope.apartments = res.data;
        },
        function error(res){
            console.log(res);
        }
    );

});

app.controller('MapCtrl', function($scope, uiGmapGoogleMapApi, uiGmapLogger, uiGmapIsReady){

    // Google Maps SDK ready event
    uiGmapGoogleMapApi.then(function(maps){});

    //// Logger
    ////uiGmapLogger.doLog = true; //no longer necessary, but if you want to disable it set it false or change currentLevel
    //uiGmapLogger.currentLevel = uiGmapLogger.LEVELS.debug;
    //log.info("hmm"); //not logged
    //log.debug("huh!"); //logged
    //log.warn("uhoh!"); //logged
    //log.error("oh crap!"); //logged

    // This service lets you know when ui-gmap is ready
    uiGmapIsReady.promise(1).then(function(instances) {
        instances.forEach(function(inst) {
            var map = inst.map; // The actual gMap (google map sdk instance of the google.maps.Map).
            var uuid = map.uiGmap_id; // A unique UUID that gets assigned to the gMap via ui-gamp api.
            var mapInstanceNumber = inst.instance; // Starts at 1. map instance number (internal counter for ui-gmap on which map)
        });
    });

    var dragstart = function(){
        console.log('dragstart');
    };
    var drag = function(){
        console.log('drag');
    };
    var dragend = function(){
        console.log('dragend');
    };
    var bounds_changed = function(){
        console.log('bounds_changed');
    };
    var marker_clicked = function(e){
        console.log(e);
    };

    $scope.map = {
        center: { latitude: "32.090882", longitude: "34.783277" },
        zoom: 15,
        events: {
            dragstart: dragstart,
            drag: drag, // fires one last time when drag stops and mouse key up
            dragend: dragend,
            bounds_changed: bounds_changed // fires one time when the map is loaded - check why // fires also when mouse wheel zooming in/out
        }
        //bounds: {
        //    northeast: { latitude: '', longitude: '' },
        //    southwest: { latitude: '', longitude: '' }
        //}
        //refresh: {latitude: 32.779680, longitude: -79.935493}
        //control: ,
        //dragging: ,
        //bounds: ,
        //pan: ,
    };

    $scope.marker = {
        id: 0,
        coords: { latitude: "32.090882", longitude: "34.783277" },
        click: marker_clicked,
        options: {
            labelContent: "Hfghjdfg",
            labelAnchor: "100 0",
            labelClass: "marker-labels"
        }
    };

    //$scope.marker.


    //$scope.map.control.refresh({latitude: 32.779680, longitude: -79.935493});


    //////NOT WORKING - CHECK
    //$scope.map.control.refresh({latitude: 32.779680, longitude: -79.935493});
    //setTimeout(function($scope){
    //
    //}, 10000);
    //
    //$scope.$on('$viewContentLoaded', function() {
    //    console.log('hello');
    //});
    //
    //$scope.$on('$viewContentLoading',function(event, viewConfig){
    //    console.log("Contents will load.");
    //});

});
