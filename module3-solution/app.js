(function () {
	'use restrict';

	angular.module('NarrowItDownApp', [])
	.controller('NarrowItDownController', NarrowItDownController)
	.service('MenuSearchService', MenuSearchService)
	.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
	.directive('foundItems', foundItemsDirective);

	function foundItemsDirective () {
		var ddo = {
			templateUrl: 'foundItemsList.html',
			scope: {
				foundItems: '<',
				onRemove: '&'
			},
			controller: 'foundItemsDirectiveController as list',
			bindToController: true
		};
		return ddo;
	}

	function foundItemsDirectiveController () {
		
	}

	NarrowItDownController.$inject = ['MenuSearchService'];
	function NarrowItDownController (MenuSearchService) {
		var menu = this;
		menu.searchTerm = "";
		menu.found = [];

		menu.getItems = function () {
			if(menu.searchTerm.length !== 0) {
				menu.found =  MenuSearchService.getMatchedMenuItems(menu.searchTerm);
			}
		}
		menu.removeItem = function (index) {
			menu.found.splice(index, 1); 
		}
	}

	MenuSearchService.$inject = ['ApiBasePath', '$http'];
	function MenuSearchService (ApiBasePath, $http) {
		var service = this;

		service.getMatchedMenuItems = function (searchTerm) {
			return $http({
				method: "GET",
				url: (ApiBasePath + "/menu_items.json")
			})
			.then(
				function (result) {
					var foundItems = [];
					var items = result.data.menu_items;
					for(var item in items) {
						if(items[item].description.indexOf(searchTerm) !== -1) {
							foundItems.push(items[item]);
						}
					}
					return foundItems;
				}
			);
		}
	}
})();