var controllers = angular.module('controllers-index', []);
$(".content").css("display", "none");
$(".loader").css("display", "block");
controllers.controller('indexController', ['$rootScope', '$scope', 'subsonicService', function ($rootScope, $scope, subsonicService) {
    console.log('index-controller')
    $scope.artists = [];


    $scope.getArtists = function (artistsCollection, callback) {
        var artists = [];
        artistsCollection.forEach(artistHolder => {
            artistHolder.artist.forEach(artist => {
                artists.push(artist);
            });
        });

        Promise.all(artists).then(function (artistsResult) {
            callback(artistsResult);
        });
    }

    $scope.reloadArtists = function () {
        if ($rootScope.isLoggedIn) {
            $scope.artists = [];
            $rootScope.subsonic.getArtists().then(function (result) {

                $scope.artists = result;

                $scope.$apply();

            });


        }
    }

    $rootScope.$on('loginStatusChange', function (event, data) {
        console.log('music reloading on subsonic ready')
        $scope.reloadArtists();
    });



    $scope.reloadArtists();


    if ($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
    $(".loader").css("display", "none");
    $(".content").css("display", "block");
}]);