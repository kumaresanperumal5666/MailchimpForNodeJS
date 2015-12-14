/**
 * @author Suresh Palanisamy<br>
 *         <p>
 *         Date Created: 28-July-2015
 *         </p>
 */

app.service("RestURL", [ '$log', '$location', function($log, $location) {
	$log.debug("App base URL: ", $location.absUrl().split("/#")[0]);

	var self = this;
	self.baseURL = $location.absUrl().split("/#")[0];

} ]);