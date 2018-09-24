var controllers = angular.module('controllers-music', []);
$(".content").css("display", "none");
$(".loader").css("display", "block");
controllers.controller('musicController', ['$rootScope', '$scope', '$location', '$sce', 'subsonicService', function ($rootScope, $scope, $location, $sce, subsonicService) {
	console.log('music-controller')

	var columnDefs = [
		{ headerName: '', width: 30, suppressSizeToFit: true, checkboxSelection: true, suppressSorting: true, suppressMenu: true, pinned: true },
		{ headerName: "Id", field: "id", width: 75, suppressSizeToFit: true },
		{ headerName: "Name", field: "name" }
	];

	$scope.gridOptions = {
		columnDefs: columnDefs,
		rowData: null,
		rowSelection: 'single',
		enableColResize: true,
		enableSorting: true,
		enableFilter: true,
		rowDeselection: true,
		animateRows: true,
		getRowNodeId: function (data) { return data.id; },
		rowMultiSelectWithClick: false,
		onModelUpdated: function (data) {
			
			var model = $scope.gridOptions.api.getModel();
			if($scope.gridOptions.rowData != null){
				var totalRows = $scope.gridOptions.rowData.length;
				var processedRows = model.getRowCount();
				$scope.rowCount = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
				console.log('onModelUpdated ' + $scope.rowCount)
			}
			
		},
		onSelectionChanged: function (data) {
			console.log('selection changed')
			var selectedRow = $scope.gridOptions.api.getSelectedRows()[0];
			
			$location.path("/artist/" + selectedRow.id.toString());
			$scope.$apply();
			console.log("/artist/" + selectedRow.id.toString());
		}
	};

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
			$rootScope.subsonic.getArtists().then(function (artistsCollection) {
				$scope.getArtists(artistsCollection, function (result) {
					$scope.artists = result;
					$scope.gridOptions.api.setRowData($scope.artists);
					$scope.gridOptions.api.sizeColumnsToFit();
					$scope.$apply();
				})
			});


		}
	}

	$rootScope.$on('loginStatusChange', function (event, data) {
		console.log('music reloading on subsonic ready')
		$scope.reloadArtists();
	});

	document.addEventListener("DOMContentLoaded", function () {
		var eGridDiv = document.querySelector('#artistsGrid');
		new agGrid.Grid(eGridDiv, $scope.gridOptions);
	});

	$scope.reloadArtists();

	if ($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
	$(".loader").css("display", "none");
	$(".content").css("display", "block");
}]);