/**
 * @author Suresh Palanisamy<br>
 *         <p>
 *         Date Created: 28-July-2015
 *         </p>
 */

app.controller("CampaignController", [
		'$scope',
		'$log',
		'$location',
		'$http',
		'$timeout',
		'$routeParams',
		'$modal',
		'RestURL',
		'CampaignData',
		function($scope, $log, $location, $http, $timeout, $routeParams,
				$modal, RestURL, CampaignData) {

			$scope.campaign = {
				campaignSno : "",
				campaignTitle : "",
				campaignLabel : "",
				campaignDescription : "",				
				emailTemplate : "",
				createdBy : "",
				createdDate : "",
				updatedBy : "",
				updatedDate : ""
			};

			$scope.template = {
				templateSno : "",
				baseTemplateId : "",
				appName : "",
				emailAddress : "",
				emailSubject : "",
				templateName : "",
				bodyHeader : "",
				bodySubject : "",
				bodyContent : "",
				bodyFooter : "",
				sourceCode : "",
				modifiedCode : "",
				createdBy : "",
				createdDate : "",
				updatedBy : "",
				updatedDate : ""
			};

			$scope.campaignsList = [];
			$scope.baseTemplatesList = [];
			$scope.templatesList = [];
			$scope.subscribersList = [];
			$scope.pickedSubscribers = [];
			$scope.testEmailIds = [];
			$scope.gridOptions = {};
			
			$scope.emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			
			$scope.openAlertDialog = function(size, msg) {
				var modalInstance = $modal.open({
					animation : true,
					size : size,
					templateUrl : 'app/views/en-US/templates/modals/campaign/alertmessage.html',
					controller : 'ModalController',
					resolve : {
						data : function() {
							return angular.copy(msg);
						},
					}
				});
				modalInstance.result.then(function(dataFromModal) {});
			};
			
			$scope.openDeleteDialog = function(id) {
				var modalInstance = $modal.open({
					animation : true,
					size : 'sm',
					templateUrl : 'app/views/en-US/templates/modals/campaign/deletecampaign.html',
					controller : 'ModalController',
					resolve : {
						data : function() {
							return angular.copy(id);
						},
					}
				});
				modalInstance.result.then(function(dataFromModal) {
					$scope.deleteCampaign(dataFromModal);
				});
			};
			
			$scope.actionButtons='<div><button class="btn btn-success btn-sm" ng-disabled="row.entity.subscriberSno == 0"' + 
			' ng-click="grid.appScope.updateSubscriber(row.entity)" style="margin:2px;"><i class="fa fa-check"></i></button>' + 
			'<button class="btn btn-danger btn-sm" ng-click="grid.appScope.deleteSubscriber(row.entity.subscriberSno)"' + 
			' ng-disabled="row.entity.subscriberSno == 0" style="margin:2px;"><i class="fa fa-trash"></i></button></div>';
			
			$scope.initializeGrid = function() {
				$scope.gridOptions = {
					data : $scope.subscribersList,
					enableSorting : true,
					enableFiltering : true,
					enableCellEditOnFocus : true,
					enableColumnResizing : true,
					enableHorizontalScrollbar : 0,
					columnDefs : [
							{
								field : 'checkbox',
								name : 'Select',
								displayName : '',
								width : '34',
								enableSorting : false,
								enableFiltering : false,
								enableCellEdit : false,
								enableHiding : false,
								enableColumnMenu : false,
								cellTemplate : '<label class="form-checkbox" style="padding: 8px;">'
										+ '<input type="checkbox" id="checkbox" ng-disabled="row.entity.subscriberSno == 0"'
										+ ' ng-click="grid.appScope.pickSubscribers(row.entity)"><span></span></label>'
							}, {
								field : 'subscriberSno',
								name : 'S. No.',
								enableCellEdit : false,
								width : '75',
							}, {
								field : 'firstName',
								name : 'First Name',
								width : '187',
							}, {
								field : 'lastName',
								name : 'Last Name',
								width : '187',
							}, {
								field : 'emailAddress',
								name : 'Email Address',
								width : '383',
							}, {
								field : 'action',
								name :'Action',
								width : '100',
								enableCellEdit : false,
								cellTemplate : $scope.actionButtons
							} ]
				};
			};
			
			$scope.addNewRow = function() {
				if ($scope.subscribersList.length < 5) {
					$scope.subscriber = {
						subscriberSno: 0,
						firstName: "Enter the first name",
						lastName: "Enter the last name",
						emailAddress: "Enter the email address",
						action: $scope.actionButtons,
					}
					$scope.subscribersList.push($scope.subscriber);
				} else {
					$scope.openAlertDialog('sm', 'Max. limit was reached!');
				}
			};
			
			$scope.pickNewTemplate = function(value) {
				if (value == undefined) {
					$("#existingtemplate").removeAttr("disabled");
				} else {
					$("#existingtemplate").attr("disabled", "disabled");
				}
			};
			
			$scope.pickExistingTemplate = function(value) {
				if (value == undefined) {
					$("#newtemplate").removeAttr("disabled");
					$scope.template.bodyHeader = "";
					$scope.template.bodySubject = "";
					$scope.template.bodyContent = "";
					$scope.template.bodyFooter = "";
					$scope.template.sourceCode = "";
					$scope.template.modifiedCode = "";
				} else {
					$("#newtemplate").attr("disabled", "disabled");
					if ($scope.templatesList.length > 0) {
						for ( var template in $scope.templatesList) {
							if ($scope.templatesList[template].templateSno == value) {
								$scope.template.bodyHeader = $scope.templatesList[template].bodyHeader;
								$scope.template.bodySubject = $scope.templatesList[template].bodySubject;
								$scope.template.bodyContent = $scope.templatesList[template].bodyContent;
								$scope.template.bodyFooter = $scope.templatesList[template].bodyFooter;
								$scope.template.sourceCode = $scope.templatesList[template].sourceCode;
								$scope.template.modifiedCode = $scope.templatesList[template].modifiedCode;
							}
						}
					}
				}
			};
			
			$scope.addNewCampaign = function() {
				$scope.campaign.emailTemplate = "";
				$location.url('/en-US/campaign/create');
			};

			$scope.editExistingCampaign = function(id) {
				for ( var campaign in $scope.campaignsList) {
					if ($scope.campaignsList[campaign]['campaignSno'] == id) {
						CampaignData.setData($scope.campaignsList[campaign]);
					}
				}
				$location.url('/en-US/campaign/update');
			};
			
			$scope.findAllCampaigns = function() {
				//var url = RestURL.baseURL + '/campaign/findAllCampaigns';
			     var url = 	"http://localhost:3000/findAllCampaigns";
				$http({
					method : "GET",
					url : url,
				}).success(function(response) {
					if (response != null) {
						$scope.campaignsList = response;
					}
				}).error(function(response) {
					$log.debug("Request Error: ", response);
				});
			};
			
			$scope.findAllTemplates = function() {
				//var url = RestURL.baseURL + '/template/findAllTemplates';
				 var url = 	"http://localhost:3000/findAllTemplates";
				$http({
					method : "GET",
					url : url,
				}).success(function(response) {
					if (response != null) {
						console.log('response',response);
						
						$scope.baseTemplatesList = response.baseTemplates;
						$scope.templatesList = response.customTemplates;
						
						console.log('base template',$scope.baseTemplatesList);
						console.log('custom template', $scope.templatesList);
					}
				}).error(function(response) {
					$log.debug("Request Error: ", response);
				});
			};
			
			$scope.findAllSubscribers = function() {
				//var url = RestURL.baseURL + '/subscriber/findAllSubscribers';
				 var url = 	"http://localhost:3000/findAllSubscribers";
				$http({
					method : "GET",
					url : url,
				}).success(function(response) {
					if (response != null) {
						$scope.subscribersList = response;
						$scope.initializeGrid();
						console.log("subscriber",$scope.subscribersList);
						console.log("dfd",response);
					}
				}).error(function(response) {
					$log.debug("Request Error: ", response);
				});
			};
			
			$scope.pickSubscribers = function(data) {
				if ($scope.pickedSubscribers.length > 0) {
					var remCount = 0;
					for ( var subs in $scope.pickedSubscribers) {
						if ($scope.pickedSubscribers[subs].subscriberSno == data.subscriberSno) {
							$scope.pickedSubscribers.splice(subs, 1);
							remCount += 1;
						}
					}
					if (remCount <= 0) {
						if ($scope.pickedSubscribers.length <= 4 && data.subscriberSno != 0) {
							$scope.pickedSubscribers.push(data);
						} else {
							$scope.openAlertDialog('sm', 'Max. limit was reached!');
						}
					}
				} else {
					if (data.subscriberSno != 0) {
						$scope.pickedSubscribers.push(data);
					}
				}
			};
			
			$scope.createSubscribers = function() {
				$scope.subscribersInfoList = [];
				var lenCheck = 0;
				for ( var index in $scope.subscribersList) {
					$scope.subscriberInfo = {
						subscriberSno : "",
						firstName : "",
						lastName : "",
						emailAddress : ""
					}
					if ($scope.subscribersList[index].subscriberSno == 0) {
						lenCheck += 1;
					}
					$scope.subscriberInfo.subscriberSno = $scope.subscribersList[index].subscriberSno;
					$scope.subscriberInfo.firstName = $scope.subscribersList[index].firstName;
					$scope.subscriberInfo.lastName = $scope.subscribersList[index].lastName;
					$scope.subscriberInfo.emailAddress = $scope.subscribersList[index].emailAddress;
					$scope.subscribersInfoList.push($scope.subscriberInfo);
				}
				if (lenCheck > 0) {
					console.log('i am in ');
					//var url = RestURL.baseURL + '/subscriber/createSubscribers';
					 var url = 	"http://localhost:3000/createSubscribers";
					$http({
						method : "POST",
						url : url,
						data : $scope.subscribersInfoList,
						headers : {
							"content-type" : "application/json",
							"Accept" : "application/json"
						},
					}).success(function(response) {
		 				if (response != null) {
							if (response.length != 0) {
								var msg = "Subscribers was created successfully!";
								$scope.subscribersList = response;
								$scope.initializeGrid();
							} else {
								//var msg = "Subscribers creation was failed, due to some internal errors!";
							}
							$scope.openAlertDialog('sm', msg);
						}
					}).error(function(response) {
						$log.debug("Request Error: ", response);
						console.log('error', response);
					});
				} else {
					var msg = "There is no new subscribers to create!";
					$scope.openAlertDialog('sm', msg);
				}
			};
			
			$scope.updateSubscriber = function(data) {
				//var url = RestURL.baseURL + '/subscriber/updateSubscriber';
				 var url = 	"http://localhost:3000/updateSubscriber";
				$http({
					method : "POST",
					url : url,
					data : {
						subscriberSno: data.subscriberSno,
						firstName: data.firstName,
						lastName: data.lastName,
						emailAddress: data.emailAddress,
					},
					headers : {
						"content-type" : "application/json",
						"Accept" : "application/json"
					},
				}).success(function(response) {
					if (response != null) {
						var msg = "Subscribers was updated successfully!";
						$scope.initializeGrid();
					} else {
						//var msg = "Subscribers updation was failed, due to some internal errors!";
					}
					$scope.openAlertDialog('sm', msg);
				}).error(function(response) {
					$log.debug("Request Error: ", response);
				});
			};
			
			$scope.deleteSubscriber = function(id) {
				//var url = RestURL.baseURL + '/subscriber/deleteSubscriber?subscriberSno=' + id;
				var subscriberSno = id;
				var url = 	"http://localhost:3000/deleteSubscriber/"+ subscriberSno;
				$http({
					method : "GET",
					url : url,
				}).success(function(response) {
					console.log('##########',response);
					if (response) {
						for ( var subscriberInfo in $scope.subscribersList) {
							if ($scope.subscribersList[subscriberInfo]['subscriberSno'] == id) {
								var msg = "Subscriber was deleted successfully!";
								$scope.subscribersList.splice(subscriberInfo, 1);
								$scope.initializeGrid();
							}
						}
					} else {
						var msg = "Subscriber deletion was failed, due to some internal errors!";
					}
					$scope.openAlertDialog('sm', msg);
				}).error(function(response) {
					$log.debug("Request Error: ", response);
				});
			};
			
			$scope.createCampaign = function() {
				$scope.campaign.emailTemplate = $scope.template;
			//	var url = RestURL.baseURL + '/campaign/createCampaign';
				var url = "http://localhost:3000/createCampaign";
				$http({
					method : "POST",
					url : url,
					data : $scope.campaign,
					headers : {
						"content-type" : "application/json",
						"Accept" : "application/json"
					},
				}).success(function(response) {
					console.log('create campaign response ',response );
					
					if (response != null) {
						if (response.campaignSno != null) {
							$scope.campaign = response;
							$scope.templatesList.push(response.emailTemplate.templateName);
							$scope.template.templateSno = response.emailTemplate.templateSno;
							$scope.template = response.emailTemplate;
							var msg = "Campaign was created successfully!";
						} else {
							var msg = "Campaign creation was failed, due to some internal errors!";
						}
						$scope.openAlertDialog('sm', msg);
					}
				}).error(function(response) {
					$log.debug("Request Error: ", response);
				});
			};

			$scope.updateCampaign = function() {
				$scope.campaign.emailTemplate = $scope.template;
				//var url = RestURL.baseURL + '/campaign/updateCampaign';
				var url = "http://localhost:3000/updateCampaign";
				$http({
					method : "POST",
					url : url,
					data : $scope.campaign,
					headers : {
						"content-type" : "application/json",
						"Accept" : "application/json"
					},
				}).success(function(response) {
					if (response != null) {
						$scope.campaign = response;
						$scope.template = response.emailTemplate;
						var msg = "Campaign was updated successfully!";
					} else {
						var msg = "Campaign updation was failed, due to some internal errors!";
					}
					$scope.openAlertDialog('sm', msg);
				}).error(function(response) {
					$log.debug("Request Error: ", response);
				});
			};
			
			$scope.deleteCampaign = function(id) {
				//var url = RestURL.baseURL + '/campaign/deleteCampaign?campaignSno=' + id;
				var campaignSno = id;
				var url = 	"http://localhost:3000/deleteCampaign/"+ campaignSno;
				
				$http({
					method : "GET",
					url : url,
				}).success(function(response) {
					console.log('delete campaign #####',response);
					if (response != null) {
						for ( var campaign in $scope.campaignsList) {
							if ($scope.campaignsList[campaign]['campaignSno'] == id) {
								var msg = "Campaign was deleted successfully!";
								$timeout(function() {
									$scope.campaignsList.splice(campaign, 1);
								}, 100);
							} else {
								var msg = "Campaign deletion was failed, due to some internal errors!";
							}
						}
						$scope.openAlertDialog('sm', msg);
					}
				}).error(function(response) {
					$log.debug("Request Error: ", response);
				});
			};
			
			$scope.subscriberEmails = [];
			$scope.sendTestEmail = function(size) {
				var msg = "Sending test email with mailchimp.!";
				var modalInstance = $modal.open({
					animation : true,
					size : size,
					templateUrl : 'app/views/en-US/templates/modals/campaign/sendtestemail.html',
					controller : 'ModalController',
					resolve : {
						data : function() {
							return angular.copy(msg);
						},
					}
				});
				modalInstance.result.then(function(dataFromModal) {
					$scope.subscriberEmails.push(dataFromModal.email);
					$scope.sendSMTPEmail();
				});
			};
			
			$scope.sendSMTPEmail = function() {
				var validEmail = 0;
				// I COMMENTED IT. WILL UNCOMMENT SOON.#########
				if ($scope.subscriberEmails == "" || $scope.subscriberEmails == null) {
					if ($scope.pickedSubscribers != null) {
						console.log('$$$$$$$$$$$$',$scope.pickedSubscribers);
						for ( var subs in $scope.pickedSubscribers) {
							if ($scope.emailRegex.test($scope.pickedSubscribers[subs].emailAddress)) {
								$scope.subscriberEmails.push($scope.pickedSubscribers[subs].emailAddress);
							} else {
								validEmail += 1;
							}
						}
					}
			      }
				if (validEmail == 0) {
					//var url = RestURL.baseURL + '/email/sendSMTPEmail';
					var url = "http://localhost:3000/sendSMTPEmail";
					$http({
						method : "POST",
						url : url,
						data : {
							receipiants : $scope.subscriberEmails,
							templateSno : $scope.template.templateSno
						},
						headers : {
							"content-type" : "application/json",
							"Accept" : "application/json"
						},
					}).success(function(response) {
						if (response != null) {
							if (response) {
								var msg = "Email was sent successfully!";
								$scope.subscriberEmails = [];
							} else {
								var msg = "Email sending was failed, due to some internal errors!";
							}
							$scope.openAlertDialog('sm', msg);
						}
					}).error(function(response) {
						$log.debug("Request Error: ", response);
					});
				} else {
					var msg = "Please provide the valid email address!";
					$scope.openAlertDialog('sm', msg);
				}
			};
			
			$scope.goBack = function() {
				$location.url("/en-US/campaigns");
			};
			
			switch ($routeParams['action']) {
			case undefined:
				$scope.findAllCampaigns();
				break;
			case 'create':
				$scope.CampaignBtn = true;
				$scope.findAllTemplates();
				$scope.findAllSubscribers();
				break;
			case 'update':
				$scope.CampaignBtn = false;
				$scope.findAllTemplates();
				$scope.findAllSubscribers();

				$scope.campaign.campaignSno = CampaignData.campaign.campaignSno;
				$scope.campaign.campaignTitle = CampaignData.campaign.campaignTitle;
				$scope.campaign.campaignLabel = CampaignData.campaign.campaignLabel;
				$scope.campaign.campaignDescription = CampaignData.campaign.campaignDescription;				
				$scope.campaign.emailTemplate = CampaignData.campaign.emailTemplate;
				$scope.campaign.createdBy = CampaignData.campaign.createdBy;
				$scope.campaign.createdDate = CampaignData.campaign.createdDate;
				$scope.campaign.updatedBy = CampaignData.campaign.updatedBy;
				$scope.campaign.updatedDate = CampaignData.campaign.updatedDate;

				$scope.template.templateName = CampaignData.campaign.emailTemplate.templateName;
				$scope.template.appName = CampaignData.campaign.emailTemplate.appName;
				$scope.template.emailAddress = CampaignData.campaign.emailTemplate.emailAddress;
				$scope.template.emailSubject = CampaignData.campaign.emailTemplate.emailSubject;
				$scope.template.bodyHeader = CampaignData.campaign.emailTemplate.bodyHeader;
				$scope.template.bodySubject = CampaignData.campaign.emailTemplate.bodySubject;
				$scope.template.bodyContent = CampaignData.campaign.emailTemplate.bodyContent;
				$scope.template.bodyFooter = CampaignData.campaign.emailTemplate.bodyFooter;
				$scope.template.sourceCode = CampaignData.campaign.emailTemplate.sourceCode;
				$scope.template.modifiedCode = CampaignData.campaign.emailTemplate.modifiedCode;
				$scope.template.createdBy = CampaignData.campaign.emailTemplate.createdBy;
				$scope.template.createdDate = CampaignData.campaign.emailTemplate.createdDate;
				$scope.template.updatedBy = CampaignData.campaign.emailTemplate.updatedBy;
				$scope.template.updatedDate = CampaignData.campaign.emailTemplate.updatedDate;
				
				$timeout(function() {
					$scope.template.templateSno = CampaignData.campaign.emailTemplate.templateSno;
					$scope.template.baseTemplateId = CampaignData.campaign.emailTemplate.baseTemplateId;
				}, 1000);
				break;
			default:
				$location.url('/en-US/campaigns');
			};
			
		} ]);