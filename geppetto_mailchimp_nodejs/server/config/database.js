// config/database.js


var mysql = require('mysql');
var connection = mysql.createConnection({
	  host      : 'localhost',
	  user      : 'root',
	  password  : 'root',
	  database  : 'mailchimp'
	});
	

module.exports = connection;

/*exports.getConnection = function(callback) {
    connection.getConnection(function(err, connection) {
        callback(err, connection);
    });
};*/

