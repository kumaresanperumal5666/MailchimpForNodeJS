/**
 * @author Suresh Palanisamy<br>
 *         <p>
 *         Date Created: 28-July-2015
 *         </p>
 */
app.factory('CampaignData', function() {
	return {
		campaign : {},
		setData : function(data) {
			this.campaign = data;
		}
	};
});