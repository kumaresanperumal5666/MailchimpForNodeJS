/**
 * @author Suresh Palanisamy<br>
 *         <p>
 *         Date Created: 28-July-2015
 *         </p>
 */

var app = angular.module("MailChimpActivity", [ 'ngRoute', 'ngCookies',
		'ui.bootstrap', 'ui.grid', 'ui.grid.pagination',
		'ui.grid.resizeColumns', 'ui.grid.edit' ]);

app.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when("/", {
		redirectTo : "/en-US/campaigns"
	}).when("/en-US/campaigns", {
		templateUrl : "app/views/en-US/user/campaigns.html",
		controller : "CampaignController"
	}).when("/en-US/campaign/:action", {
		templateUrl : "app/views/en-US/user/campaign.html",
		controller : "CampaignController"
	}).otherwise({
		redirectTo : "/en-US/campaigns"
	});
} ]);

app.run([ '$log', function($log) {
	$log.debug("Started loading the application.!");
} ]);