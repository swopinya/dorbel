/**
 * Created by Shimon on 07/10/2015.
 */
var app = angular.module('dorbelApp.controllers', [
    'dorbelApp.services'
]);
var base_url = 'http://dorbel-server.herokuapp.com';

app.controller('ListCtrl', function ($scope, $rootScope, $http, my_map) {

    $http.get(base_url + '/apartments-list').then(
        function success(res) {
            $scope.apartments = res.data;
            my_map.set_apartments(res.data);
        },
        function error(res) {
            console.log(res);
        }
    );

});

app.directive('checkLast', function ($rootScope) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            if (scope.$last === true) {
                var onscreen_apartments = [];
                element.ready(function () {  // or maybe $timeout
                    $('.row').onScreen({
                        container: $('.col:nth-child(1)'),
                        direction: 'vertical',
                        doIn: function () {
                            broadcast();
                        },
                        doOut: function () {
                            broadcast();
                        },
                        tolerance: 0,
                        throttle: 50,
                        toggleClass: 'onScreen',
                        lazyAttr: null,
                        lazyPlaceholder: 'someImage.jpg',
                        debug: false
                    });
                    function generate_onscreen() {
                        var arr = [];
                        $.each($('.row'), function (i) {
                            if ($(this).hasClass('onScreen')) {
                                arr.push(scope.apartments[i]);
                            }
                        });
                        return arr;
                    }

                    function broadcast() {
                        $rootScope.$broadcast('apartmentsRendered', generate_onscreen());
                        scope.$apply();
                    }

                    $.each($('.row'), function (i) {
                        if (!$('.col').isChildOverflowing('.row:eq(' + i + ')')) onscreen_apartments.push(scope.apartments[i]);
                    });
                    $rootScope.$broadcast('apartmentsRendered', onscreen_apartments);
                });
            }
        }
    }
});

app.controller('MapCtrl', function ($scope, $rootScope, uiGmapGoogleMapApi, uiGmapLogger, uiGmapIsReady, my_map) {

    var apartments = [];
    $rootScope.$on('apartmentsRendered', function (e, aps) {
        apartments = aps;
        generate_markers();
        fit_markers();
        //calculate_map_center();
    });

    //function calculate_map_center() {
    //    var tot_lat = 0, tot_lon = 0, len = apartments.length;
    //    for (var i = 0 in apartments) {
    //        tot_lat += apartments[i].point.latitude;
    //        tot_lon += apartments[i].point.longitude;
    //    }
    //    var cen_lat = tot_lat / len;
    //    var cen_lon = tot_lon / len;
    //    $scope.map.center = {latitude: cen_lat, longitude: cen_lon};
    //}

    function generate_markers() {
        var markers = [];
        for (var i = 0; i < apartments.length; i++) {
            markers.push(create_marker(i, apartments[i].point))
        }
        $scope.markers = markers;
    }

    function create_marker(i, point, idKey) {
        var ret = {
            latitude: point.latitude,
            longitude: point.longitude,
            title: 'm' + i,
            events: {
                mouseover: function(e){
                    var map_pos = $('.angular-google-map-container').position();
                    var top = map_pos.top + 20;
                    var left = map_pos.left;
                    var apt = apartments[i];
                    var $map_tooltip = $('.map-tooltip');
                    $scope.image_src = apt.image;
                    $scope.address = apt.address.street + ', ' + apt.address.city + ' | ' + apt.address.area;
                    $map_tooltip.css({
                        'position': 'absolute',
                        'top': top + 'px',
                        'left': left + 'px'
                    }).toggle();

                },
                mouseout: function(e){
                    var $map_tooltip = $('.map-tooltip');
                    $scope.address = '';
                    $scope.image_src = '';
                    $map_tooltip.toggle();
                }
            }
        };
        idKey = 'id';
        ret[idKey] = i;
        return ret;
    }
    function fit_markers(){
        var markers = $scope.markers;
        var lat_arr = [], lon_arr = [];
        for(var i = 0 in markers){
            lat_arr.push(markers[i].latitude);
            lon_arr.push(markers[i].longitude);
        }
        $scope.map.bounds = {
            northeast: { latitude: Math.max.apply(Math,lat_arr), longitude: Math.max.apply(Math,lon_arr) },
            southwest: { latitude: Math.min.apply(Math,lat_arr), longitude: Math.min.apply(Math,lon_arr) }
        };
    }

    // Google Maps SDK ready event
    uiGmapGoogleMapApi.then(function(maps){});

    // This service lets you know when ui-gmap is ready
    uiGmapIsReady.promise(1).then(function (instances) {
        instances.forEach(function (inst) {
            var map = inst.map; // The actual gMap (google map sdk instance of the google.maps.Map).
            var uuid = map.uiGmap_id; // A unique UUID that gets assigned to the gMap via ui-gamp api.
            var mapInstanceNumber = inst.instance; // Starts at 1. map instance number (internal counter for ui-gmap on which map)
        });
    });

    var dragstart = function () {
        console.log('dragstart');
    };
    var drag = function () {
        console.log('drag');
    };
    var dragend = function () {
        console.log('dragend');
    };
    var bounds_changed = function () {
        console.log('bounds_changed');
    };

    $scope.map = {
        center: {latitude: "32.090882", longitude: "34.783277"},
        zoom: 15,
        events: {
            dragstart: dragstart,
            drag: drag, // fires one last time when drag stops and mouse key up
            dragend: dragend,
            bounds_changed: bounds_changed // fires one time when the map is loaded - check why // fires also when mouse wheel zooming in/out
        },
        bounds: {}
    };

});
