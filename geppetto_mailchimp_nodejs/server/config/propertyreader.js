/**
 * created by Kumaresan Perumal
 * date : 27- nov - 2015
 *  Here we get the SQL query files and return the queries.  
 * */
var PropertiesReader = require('properties-reader');
var campaign_sql = PropertiesReader('./server/sql_properties/campaign_sql.properties');
/*var subscriber_sql = PropertiesReader('./server/sql_properties/subscriber_sql.properties');
var template_sql = PropertiesReader('./server/sql_properties/template_sql.properties');*/
/*var findAllCampaigns = properties.get('main.findAllCampaigns');
var findCampaign = properties.get('main.findCampaign');
var createCampaign = properties.get('main.createCampaign');
var updateCampaign = properties.get('main.updateCampaign');
var deleteCampaign = properties.get('main.deleteCampaign');

*/
module.exports = campaign_sql;
/*module.exports = subscriber_sql;
module.exports = template_sql;*/
