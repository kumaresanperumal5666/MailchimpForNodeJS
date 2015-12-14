var pool = require('../config/database');
var subscriberSql = require('../config/subscriberreader');

console.log("find all subscribers controller in server side ");

module.exports.findAllSubscribers = function(req, res) {
	console.log("find all subscribers controller called in server !!");
	var findAllSubscribers = subscriberSql.get('main.findAllSubscribers');

	//var findAllSubscribers = "select * from subscribers";
	var query = pool.query(findAllSubscribers, function(err, result) {
		if (err) {
			console.error(err);
			return;
		}
		var subscriberList = [];
		var subscriberObject = {
			subscriberSno  : "",
			firstName      : "",
			lastName       : "",
			emailAddress   : "",
		};
		
		for (var int = 0; int < result.length; int++) {
			subscriberObject = new Object();
			        subscriberObject.subscriberSno = result[int].subscriber_sno,
					subscriberObject.firstName     = result[int].first_name,
					subscriberObject.lastName      = result[int].last_name,
					subscriberObject.emailAddress  = result[int].email_address,
					subscriberList.push(subscriberObject);
		}
		//console.error(result);
		res.send(subscriberList);
	});
};

module.exports.createSubscribers = function(req, res) {

	var subscribers = {
		subscriber_sno : "",
		email_address : "",
		first_name : "",
		last_name : "",
	};

	var subscribersArrayList = req.body;
	var returningWithIdArrayList = [];
	var createSubscriber = subscriberSql.get('main.createSubscriber');
	for (var int = 0; int < subscribersArrayList.length; int++) {
		var subscribers = new Object();
		console.log('#####',subscribersArrayList[int].subscriberSno);
		
		if (subscribersArrayList[int].subscriberSno == 0) {
			        subscribers.subscriber_sno = subscribersArrayList[int].subscriberSno;
					subscribers.email_address = subscribersArrayList[int].emailAddress,
					subscribers.first_name = subscribersArrayList[int].firstName,
					subscribers.last_name = subscribersArrayList[int].lastName,
					console.log('if condition log data',
							subscribersArrayList[int]);
			pool.query(createSubscriber, subscribers, function(err, res) {
				if (err)
					throw err;

				returningWithIdArrayList = subscribersArrayList[int];
				// HERE WE HAVE TO GET LAST INSERTED ID TO RETURN THESE OBJECTS
				// WITH IDS;
				console.log('Last insert ID:', res.insertId);
			});
		} else {
			console.log('else');
			returningWithIdArrayList = subscribersArrayList[int];
		}
	}
	res.send(returningWithIdArrayList);

};

module.exports.deleteSubscriber = function(req, res) {

	var subscriberSno = req.params.subscriberSno;
	console.log('subscriber sno ', subscriberSno);
	var deleteSubscriber = subscriberSql.get('main.deleteSubscriber');
	var isBoolean;
	pool.query(deleteSubscriber, subscriberSno, function(err, result) {
		if (err)
			throw err;
		isBoolean = true;
		console.log('Deleted ' + result.affectedRows + ' rows');
		res.send(isBoolean);
	});
	
};

module.exports.updateSubscriber = function(req, res) {

	var subscribers = {
		email_address : req.body.emailAddress,
		first_name : req.body.firstName,
		last_name : req.body.lastName,
		subscriber_sno : req.body.subscriberSno,

	};
	var updateSubscriber = subscriberSql.get('main.updateSubscriber');
	pool.query(updateSubscriber, [ subscribers.email_address,
			subscribers.first_name, subscribers.last_name,
			subscribers.subscriber_sno ], function(err, result) {
		if (err)
			throw err;
		console.log('Changed ' + result.changedRows + ' rows');
	});

};
