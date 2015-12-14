/**
 * @author Suresh Palanisamy<br>
 *         <p>
 *         Date Created: 28-July-2015
 *         </p>
 */

app.controller('ModalController', [ '$scope', '$modalInstance', 'data',
		function($scope, $modalInstance, data) {

		$scope.modalData = {};

		$scope.modalData.message = data;
		$scope.modalData.id = data;
		$scope.modalData.email = null;

		$scope.modalData.multiselectsettings = {
			scrollableHeight : '200px',
			scrollable : true
		};

		$scope.ok = function(action) {
			$scope.modalData.action = action;
			$modalInstance.close($scope.modalData);
		};

		$scope.close = function() {
			$modalInstance.dismiss('cancel');
		};

		$scope.deleteHandler = function() {
			$modalInstance.close($scope.modalData.id);
		};

} ]);