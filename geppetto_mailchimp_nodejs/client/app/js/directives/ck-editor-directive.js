app.directive('ckEditor', function() {
	return {
		require : '?ngModel',
		compile : function() {
			return function($scope, elem, attr, ngModel) {
				var ck = CKEDITOR.replace(elem[0], {
					toolbar : 'Basic',
					uiColor : '#fafafa'
				});

				if (!ngModel)
					return;

				ck.on('instanceReady', function() {
					ck.setData(ngModel.$viewValue);
				});

				function updateModel() {
					$scope.$apply(function() {
						ngModel.$setViewValue(ck.getData());
					});
				}

				ck.on('change', updateModel);
				ck.on('key', updateModel);
				ck.on('dataReady', updateModel);

				ngModel.$render = function(value) {
					ck.setData(ngModel.$viewValue);
				};
			};
		}
	};
});