
/**
 * Module dependencies.
 */

var express               = require('express');
var app                   = express();
var bodyParser            = require('body-parser');
var connection            = require('express-myconnection');
var campaignController    = require('./server/controllers/CampaignController');
var templateController    = require('./server/controllers/TemplateController');
var subscriberController  = require('./server/controllers/SubscriberController');
var emailController       = require('./server/controllers/EmailController');

var connection          = require('./server/config/database');
var mysql               = require('mysql');
/*var directConnection  = mysql.createConnection({
        host        : 'localhost',
        user        : 'root',
        password    : 'root',
        database    : 'contactdb',
        port        : 3306
    });
*/

app.use(bodyParser.json()); 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.urlencoded({ extended: true })); 

//HERE WE MENTION THE DIRECTORY, IF IT IS NOT, YOU WILL GET 404 FOUND ERROR.
app.use(express.static(__dirname + '/client'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/server'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/client/app/views/index.html');
});

//HERE WE MENTION THE DIRECTORY, IF IT IS NOT, YOU WILL GET 404 FOUND ERROR.
app.use('/js', express.static(__dirname + '/client/js'));

//CONNECTION CODING
/*app.use(
	    connection(mysql,{
	        host     : 'localhost',
	        user     : 'root',
	        password : 'root',
	        port     : 3306, //port mysql
	        database :'contactdb'
	    },'pool')
	);*/

//REST API

app.get('/findAllCampaigns' , campaignController.findAllCampaigns);
app.get('/findAllTemplates' , templateController.findAllTemplates);
app.post('/createCampaign' , campaignController.createCampaign);
app.post('/findCampaign' , campaignController.findCampaign);
app.post('/updateCampaign' , campaignController.updateCampaign);
app.get('/deleteCampaign/:campaignSno' , campaignController.deleteCampaign);

app.get('/findAllSubscribers' , subscriberController.findAllSubscribers);
app.post('/createSubscribers' ,  subscriberController.createSubscribers);
app.post('/updateSubscriber' ,   subscriberController.updateSubscriber);
app.get('/deleteSubscriber/:subscriberSno' , subscriberController.deleteSubscriber);

app.post('/sendSMTPEmail',emailController.sendSMTPEmail);

//app.post('/api/meetups', meetupsController.create);
//app.post('/save', meetupsController.save);

/*app.post('/updateSubscriber', function (req, res){
	  console.log("POST: ",req.body);
});*/


app.listen(3000, function() {
  console.log('I\'m Listening to you ...');
});