var pool = require('../config/database');
var templateSql = require ('../config/templateReader');

console.log("Template controller begins !");    
var map = {
		baseTemplates :"",
		customTemplates : "",
		
};

module.exports.findAllTemplates = function(req, res) {
	console.log('find all template controller node js works !!!!');
	console.log("findAllTemplates controller called in server !!");
	var findAllBaseTemplates = templateSql.get('main.findAllBaseTemplates');
	//var findAllBaseTemplates = "select * from base_templates";
	var query = pool.query(findAllBaseTemplates, function(err, result) {
		if (err) {
			console.error(err);
			return;
		}
		console.log("find all template result",result);
		var baseTemplates = [];
		var baseT = {
	            templateSno: "",
	            templateName: "",
	            sourceCode: "",
		}
		for (var int = 0; int < result.length; int++) {
			var baseT = new Object();
			baseT.templateSno  = result[int].template_sno;
			baseT.templateName = result[int].template_name;
			baseT.sourceCode   = result[int].source_code;
			baseTemplates.push(baseT);
		}
		//baseTemplates = JSON.stringify(result);
		map.baseTemplates = baseTemplates;
		//console.log('map', map);
		//res.send(map);
		//return result;
	});
	
	console.log("findAllBaseTemplates controller called in server !!");
	var data;
	var findAllTemplates = templateSql.get('main.findAllTemplates');
	//var findAllTemplates = "select * from templates";
	var query = pool.query(findAllTemplates, function(err, result) {
		if (err) {
			console.log(err);
			return;
		}
		//console.log("findAll  Template result",result);
		var customTemplates = [];
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

		for (var int = 0; int < result.length; int++) {
		
			template.templateSno    = result[int].template_sno;
			template.baseTemplateId = result[int].base_template_id;
			template.appName        = result[int].app_name;
			template.emailAddress   = result[int].email_address;
			template.emailSubject   = result[int].email_subject;
			template.templateName   = result[int].template_name;
			template.bodyHeader     = result[int].body_header;
			template.bodySubject    = result[int].body_subject;
			template.bodyContent    = result[int].body_content;
			template.bodyFooter     = result[int].body_footer;
			template.sourceCode     = result[int].source_code;
			template.modifiedCode   = result[int].modified_code;
			template.createdBy      = result[int].created_by;
			template.createdDate    = result[int].created_date;
			template.updatedBy      = result[int].updated_by;
			template.updatedDate    = result[int].updated_date;
			customTemplates.push(template);
		}
		//customTemplates = JSON.stringify(result);
		map.customTemplates = customTemplates;
		//return result;
		res.send(map);
	});
};

/*module.exports.findAllTemplates = function(req, res) {
	console.log('find all template controller node js works !!!!');
	
	var findAllT = findAllTemplate(function (err,data){
		console.log('call back data', data);
		m['baseTemplates'] = findAllT;
	});
	
	var findAllBaseT = findAllBaseTemplate(function (err, data){
		//console.log('findAllBase template', data);
		m['customTemplates'] = findAllBaseT;
		console.log("received hash map",m);
		res.send(m);
	});
	
};*/

function findAllTemplate() {
	console.log("findAllTemplates controller called in server !!");
	//var findAllTemplates = "select * from templates";
	var findAllTemplates = templateSql.get('main.findAllTemplates');
	var query = pool.query(findAllTemplates, function(err, result) {
		if (err) {
			console.error(err);
			return;
		}
		// console.log("find all template result",result);
		return result;
	});
};

function findAllBaseTemplate() {

	console.log("findAllBaseTemplates controller called in server !!");
	var data;
	//var findAllBaseTemplates = "select * from base_templates";
	var findAllBaseTemplates = templateSql.get('main.findAllBaseTemplates');
	var query = pool.query(findAllBaseTemplates, function(err, result) {
		if (err) {
			console.log(err);
			return;
		}
		// console.log("findAll base Template result",result);
		return result;
	});
};

module.exports.findBaseTemplate = function(req, res) {
	var templateSno = req.params.templateSno;
	console.log('templateSno is : ', templateSno);

	var BaseTemplate = {
		templateSno : "",
		templateName : "",
		sourceCode : "",
	}
	var findBaseTemplate = templateSql.get('main.findBaseTemplate');
	//var findBaseTemplate = "SELECT * FROM base_templates WHERE template_sno = ?";
	var query = pool.query(findBaseTemplate, templateSno,
			function(err, result) {
				if (err) {
					console.error(err);
					return;
				}

				BaseTemplate.templateSno = result.templateSno,
						BaseTemplate.templateName = result.templateName,
						BaseTemplate.sourceCode = result.sourceCode, console
								.log('result is : ', result);
			});
	res.send(BaseTemplate);
};

module.exports.findTemplate = function(res, req) {
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

module.exports.createTemplate = function(req, res) {
   console.log('The request body is', req.body);
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
	
	/*String replacingContent = template.sourceCode().replace("*|BODYHEADER|*", template.bodyHeader());
	replacingContent = replacingContent.replace("*|BODYSUBJECT|*", template.bodySubject());
	replacingContent = replacingContent.replace("*|BODYCONTENT|*", template.bodyContent());
	replacingContent = replacingContent.replace("*|BODYFOOTER|*", template.bodyFooter());
	replacingContent = replacingContent.replace("*|APPNAME|*", template.appName());
	replacingContent = replacingContent.replace("*|EMAILADDRESS|*", template.emailAddress());*/
	
	console.log('The content is', replacingContent);
	
	var templateObj = templateSql.get('main.templateObj');
	//var templateObj = "INSERT INTO templates SET ?";
	pool.query(templateObj, template, function(err, res) {
		if (err)
			throw err;

		console.log('Last insert ID:', res.insertId);
	});

};

module.exports.updateTemplate = function(req, res) {

};

module.exports.deleteTemplate = function(req, res) {
	var templateSno = req.params.templateSno;
	console.log('templateSno is : ', templateSno);
	var deleteTemplate = templateSql.get('main.deleteTemplate');
	
	//var deleteTemplate = "DELETE FROM templates WHERE template_sno = ?";
	pool.query(deleteTemplate, templateSno, function(err, result) {
		if (err)
			throw err;
		console.log('Deleted ' + result.affectedRows + ' rows');
	});
};

