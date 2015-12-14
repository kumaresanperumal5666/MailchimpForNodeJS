var pool = require('../config/database');
var templateSql = require('../config/templateReader');

module.exports.findTemplate = function(req, res) {
	var templateSno = req.params.templateSno;
	console.log('templateSno is : ', templateSno);
	
	var findTemplate = templateSql.get('main.findTemplate');
	//var findTemplate = "select * from templates where template_sno = ?";
	var template = {
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
	var query = pool.query(findTemplate, templateSno, function(err, result) {
		if (err) {
			console.error(err);
			return;
		}
		console.log('result is : ', result);
	});
	res.send(template);
};
// I HAVE GOT TWO BUGS FROM EMAILJS SMTP USING GMAIL ACCOUNT. 
//1. CHAIN BUGS IS CLEANED  TO DISABLE ANTIVIRUS
//2. AUTHORIZATION FAILED BUG TO GIVE LESS APP SECURITY FOR YOUR EMAIL.

module.exports.sendSMTPEmail = function(req, res) {
	
	//var templateSno = req.params.templateSno;
	var templateSno = req.body.templateSno;
	console.log('templateSno is : ', templateSno);
	console.log('###########', req.body.receipiants);
	
	var findTemplate = templateSql.get('main.findTemplate');
	//var findTemplate = "select * from templates where template_sno = ?";
	var template = {
		templateSno    : "",
		baseTemplateId : "",
		appName        : "",
		emailAddress   : "",
		emailSubject   : "",
		templateName   : "",
		bodyHeader     : "",
		bodySubject    : "",
		bodyContent    : "",
		bodyFooter     : "",
		sourceCode     : "",
		modifiedCode   : "",
		createdBy      : "",
		createdDate    : "",
		updatedBy      : "",
		updatedDate    : ""
	};
	var data ;
	var query = pool.query(findTemplate, templateSno, function(err, result) {
		if (err) {
			console.error(err);
			return;
		}
		
		for (var int = 0; int < result.length; int++) {
			template.templateSno = result[int].template_sno;
			template.baseTemplateId = result[int].base_template_id;
			template.appName = result[int].app_name;
			template.emailAddress = result[int].email_address;
			template.emailSubject = result[int].email_subject;
			template.templateName = result[int].template_name;
			template.bodyHeader = result[int].body_header;
			template.bodySubject = result[int].body_subject;
			template.bodyContent = result[int].body_content;
			template.bodyFooter = result[int].body_footer;
			template.sourceCode = result[int].source_code;
			template.modifiedCode = result[int].modified_code;
			template.createdBy = result[int].created_by;
			template.createdDate = result[int].created_date;
			template.updatedBy = result[int].updated_by;
			template.updatedDate = result[int].updated_date;
		}
		//console.log('result is : ', result);
		console.log('modified code ',template.modifiedCode);
		console.log('email subject ',template.emailSubject);
		
		var email   = require("G:/nodeworkspace/geppetto_mailchimp_nodejs/node_modules/emailjs/email.js");
		var server  = email.server.connect({
		   user     :    "bluejays5666@gmail.com", 
		   password :    "snakefrog", 
		   host     :    "smtp.gmail.com", 
		   ssl      :     true
		});
		 
		var message = {
		   text   :  template.modifiedCode, 
		   from   :  "bluejays5666@gmail.com", 
		   to     : req.body.receipiants,  // This is an array list
		  //to     :  ["bluejays5666@gmail.com","bluesparrows55@gmail.com"],
		  //cc    :      "else <else@your-email.com>",
		   subject:  template.emailSubject,
		   attachment: 
		   [
		      {data : template.modifiedCode, alternative: true},
		 
		   ],
		};
		// send the message and get a callback with an error or details of the message that was sent 
		server.send(message, function(err, message) { console.log(err || message); });
		
	});
};
	

/*
{ attachments: [],
	  alternative: 
	   { data: '<html>i <i>hope</i> this works!</html>',
	     alternative: true,
	     charset: 'utf-8',
	     type: 'text/html',
	     inline: true },
	  header: 
	   { 'message-id': '<1448620837348.0.5868@TROGON-VAIO>',
	     date: 'Fri, 27 Nov 2015 16:10:37 +0530',
	     from: 'bluejays5666@gmail.com',
	     to: 'bluejays5666@gmail.com',
	     subject: '=?UTF-8?Q?testing_emailjs?=' },
	  content: 'text/plain; charset=utf-8',
	  text: 'i hope this works' }
*/
