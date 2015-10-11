/**
 * Created by Shimon on 07/10/2015.
 */
var app = angular.module('dorbelApp.controllers', [
    'dorbelApp.services'
]);
//var base_url = 'http://dorbel-server.herokuapp.com';
var base_url = 'http://localhost:3000';

app.controller('ListCtrl', function ($scope, $rootScope, $http, $filter, my_map) {

    var orderBy = $filter('orderBy');
    var date_sort = 'DES';
    $http.get(base_url + '/apartments-list').then(
        function success(res) {
            var aps = published(res.data);
            $scope.count = aps.length;
            $scope.apartments = aps;
            console.log(aps[0]);
            my_map.set_apartments(aps);
        },
        function error(res) {
            console.log(res);
        }
    );


    //$scope.order = function(predicate, sort_by) {
    //    $scope.date_sort_mark = '▼';
    //    $scope.apartments = orderBy($scope.apartments, predicate, reverse);
    //};
    //
    //$scope.dateSort = function (){
    //    var sort_type = '';
    //    if(date_sort == 'DES'){
    //        date_sort = 'ASC';
    //        $scope.date_sort_mark = '▼';
    //        sort_type = 'DATE_DES';
    //    }
    //    else{
    //        date_sort = 'DES';
    //        $scope.date_sort_mark = '▲';
    //    }
    //};


});

function published(aps){
    for(var i = 0 in aps){
        var count_type = '';
        var publish = aps[i].publish;
        if(publish >= 24) {
            publish = parseInt(publish / 24)+1;
            count_type = ' ימים';
        }
        else count_type = ' שעות';
        //console.log(aps[i].publish + ' : ' + publish + ' : ' + count_type);
        aps[i].published_str = 'הועלה לפני '+publish+count_type;
        aps[i].publish_type = count_type.replace(/\s/g, '');
    }
    return aps;
}

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

app.controller('MapCtrl', function ($scope, $rootScope, uiGmapGoogleMapApi, uiGmapLogger, uiGmapIsReady) {

    var apartments = [];
    $rootScope.$on('apartmentsRendered', function (e, aps) {
        apartments = aps;
        generate_markers();
        fit_markers();
    });

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
        //console.log('dragstart');
    };
    var drag = function () {
        //console.log('drag');
    };
    var dragend = function () {
        //console.log('dragend');
    };
    var bounds_changed = function () {
        //console.log('bounds_changed');
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
