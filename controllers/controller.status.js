var controllers = angular.module('controllers-status', []);
$(".content").css("display", "none");
$(".loader").css("display", "block");
controllers.controller('statusController', ['$rootScope', '$scope', 'subsonicService', function($rootScope, $scope, subsonicService) {
	console.log('status-controller')
	
	$scope.ping = function(){
		if($rootScope.isLoggedIn){
			var ping = subsonicService.ping();
			if(ping){
				ping.then(function(data) {
					console.log('ping ' + data);
					$scope.server = data;
					$scope.$apply();
				});
			}	
		}
    };
    
    $scope.getUserInfo = function(){
        if($rootScope.isLoggedIn){
            $rootScope.subsonic.getUserInfo().then(function (userInfo) {
                console.log('ping ' + userInfo);
                $scope.userInfo = userInfo;
                $scope.$apply();
            });
        }
    };

    $scope.getMediaFolders = function(){
        if($rootScope.isLoggedIn){
            $rootScope.subsonic.getMusicFolders().then(function (data) {
            
                $scope.folders = data;
                $scope.$apply();
            });
        }
    };

    $scope.startScan = function(){
        if($rootScope.isLoggedIn){
            $rootScope.subsonic.startScan().then(function (data) {
                $scope.scanStatus = data;
                $scope.$apply();
            });
        }
    };

    $scope.getScanStatus = function(){
        if($rootScope.isLoggedIn){
            $rootScope.subsonic.getScanStatus().then(function (data) {
                $scope.scanStatus = data;
                $scope.$apply();
            });
        }
    };

	$rootScope.$on('loginStatusChange', function (event, data) {
        $scope.ping();
        $scope.getUserInfo();
        $scope.getMediaFolders();
	});

	$scope.refreshIntereval = setInterval(function(){
        $scope.ping();
        $scope.getUserInfo();
        $scope.getMediaFolders();
        $scope.getScanStatus();
	}, 5000);


	$scope.$on('$destroy', function () { clearInterval($scope.refreshIntereval); });
	$scope.ping();
	$scope.getUserInfo();
	$scope.getMediaFolders();
	if($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
	$(".loader").css("display", "none");
	$(".content").css("display", "block");
}]);