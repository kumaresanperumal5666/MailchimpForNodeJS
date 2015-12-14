var pool = require('../config/database');
var campaignSql = require('../config/propertyreader');

console.log("find all campaign ");
module.exports.findAllCampaigns = function(req, res) {

	console.log("find all campaign controller called in server !!");
	var findAllCampaigns = campaignSql.get('main.findAllCampaigns');
	//var findAllCampaigns = "select * from campaigns c join templates t on t.template_sno=c.template_id";
	var data = [];
	var query = pool.query(findAllCampaigns, function(err, result) {
		if (err) {
			console.error(err);
			return;
		}
		var campaign = {
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
		// console.log("result data ", JSON.stringify(result));
		// res.send( JSON.stringify(result));

		for (var int = 0; int < result.length; int++) {
			campaign = new Object();
			template = new Object();

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

			campaign.campaignSno = result[int].campaign_sno;
			campaign.campaignTitle = result[int].campaign_title;
			campaign.campaignLabel = result[int].campaign_label;
			campaign.campaignDescription = result[int].campaign_description;
			campaign.emailTemplate = template;
			campaign.createdBy = result[int].created_by;
			campaign.createdDate = result[int].created_date;
			campaign.updatedBy = result[int].updated_by;
			campaign.updatedDate = result[int].updated_date;
			data.push(campaign);
		}
		res.send(data);
	});

};

module.exports.findCampaign = function(req, res) {
	var findCampaign = campaignSql.get('main.findCampaign');
	//var findCampaign = "select * from campaigns where campaign_sno=:campaign_sno";
	pool.query(findCampaign, function(err, rows) {
		if (err)
			throw err;

		console.log('Data received from Db:\n');
		console.log(rows);
	});
};

module.exports.createCampaign = function(req, res) {
	var createCampaign = campaignSql.get('main.createCampaign');
    var templateObj = campaignSql.get('main.templateObj');
	//console.log('Template query is ', templateObj );
	
	//var createCampaign = "INSERT INTO campaigns SET ?";
	//var templateObj    = "INSERT INTO templates SET ?";
    var dateSys = new Date();
	var campaign = {
		//	campaign_sno      : req.body.campaignSno,
		campaign_title        : req.body.campaignTitle,
		campaign_label        : req.body.campaignLabel,
		campaign_description  : req.body.campaignDescription,
		//template_id         : req.body.emailTemplate.templateSno,
		template_id           : "", // WE HAVE TO SET LAST INSERTED TEMPLATE ID HERE. console.log('Last insert ID:', res.insertId);
		created_by            : 9999, //req.body.createdBy ,//
		created_date          : dateSys, //req.body.createdDate,
		updated_by            : 9999, //req.body.updatedBy,
		updated_date          : null, //req.body.updatedDate,

	};
	
	var template = {
		//templateSno      :req.body.emailTemplate.templateSno,
		app_name         : req.body.emailTemplate.appName,
		base_template_id : req.body.emailTemplate.baseTemplateId,
		body_content     : req.body.emailTemplate.bodyContent,
		body_footer      : req.body.emailTemplate.bodyFooter,
		body_header      : req.body.emailTemplate.bodyHeader,
		body_subject     : req.body.emailTemplate.bodySubject,
		created_by       : 9999,
		created_date     : dateSys,
		email_address    : req.body.emailTemplate.emailAddress,
		email_subject    : req.body.emailTemplate.emailSubject,
		modified_code    : req.body.emailTemplate.modifiedCode,
		source_code      : req.body.emailTemplate.sourceCode,
		template_name    : req.body.emailTemplate.templateName,
		updated_by       : 9999,
		updated_date     : null,
	};
	
	//FIRST WE NEED TO CREATE TEMPLATE OBJECT
	// find base template template.getBaseTemplateId()
	var baseTemplateId = req.body.emailTemplate.baseTemplateId;
	//console.log('base template id ', baseTemplateId);
	var baseTemplating  = campaignSql.get('main.baseTemplate');
	//"SELECT * FROM base_templates WHERE template_sno = ?"
	pool.query(baseTemplating,baseTemplateId, function(err, baseTemplate) {
		if (err)
			throw err;
		
		//if (baseTemplate != null) {
			template.source_code = baseTemplate[0].source_code;
		//} else {
		//	template.setBaseTemplateId(template.TemplateSno());
		//}
		//console.log('base template source code',baseTemplate);
		//console.log('source code',template.source_code);
		var lastInsertedId;
		var  replacingContent;
		replacingContent = template.source_code.replace("*|BODYHEADER|*", req.body.emailTemplate.bodyHeader);
		replacingContent = replacingContent.replace("*|BODYSUBJECT|*", req.body.emailTemplate.bodySubject);
		replacingContent = replacingContent.replace("*|BODYCONTENT|*", req.body.emailTemplate.bodyContent);
		replacingContent = replacingContent.replace("*|BODYFOOTER|*", req.body.emailTemplate.bodyFooter);
		replacingContent = replacingContent.replace("*|APPNAME|*", req.body.emailTemplate.appName);
		replacingContent = replacingContent.replace("*|EMAILADDRESS|*",req.body.emailTemplate.emailAddress);

		template.modified_code  = replacingContent;
		//console.log('replaced content @@@ ', replacingContent);
		console.log('template object is ', template);
		
		//console.log('template object is ', template);
		pool.query(templateObj, template, function(err, res) {
			if (err)
				throw err;
			
			console.log('replaced content @@@ ', replacingContent);
			
			lastInsertedId = res.insertId
			console.log('my test $$$$$$$$$', lastInsertedId);
			console.log('campaing object is ', campaign);
			campaign.template_id = lastInsertedId;
			console.log("###########", campaign );
			///console.log('Last insert ID:', res.insertId);
			console.log('YYYYYYY#########',campaign.template_id)
			
			/// HERE WE HAVE TO INSERT CAMPAIGN RECORD AFTER INSERTING THE TEMPLATE RECORD  
			pool.query(createCampaign, campaign, function(err, res) {
				if (err)
					throw err;

				console.log('Last insert ID:', res.insertId);
				//res.send(campaign);
			});
		
		});

		/*/// HERE WE HAVE TO INSERT CAMPAIGN RECORD AFTER INSERTING THE TEMPLATE RECORD  
		pool.query(createCampaign, campaign, function(err, res) {
			if (err)
				throw err;

			console.log('Last insert ID:', res.insertId);
			//res.send(campaign);
		});
		*/
	});

};

module.exports.updateCampaign = function(req, res) {

	var updateCampaign = campaignSql.get('main.updateCampaign');
	var updateTemplate = campaignSql.get('main.updateTemplate');
	console.log('update',updateCampaign);
	console.log('updateTemplate',updateTemplate);
	var dateSys = new Date();
	var campaign = {
		campaign_sno : req.body.campaignSno,
		campaign_title : req.body.campaignTitle,
		campaign_label : req.body.campaignLabel,
		campaign_description : req.body.campaignDescription,
		//template_id          : req.body.emailTemplate.templateSno,
		template_id : req.body.emailTemplate.templateSno, // WE HAVE TO SET LAST INSERTED TEMPLATE ID HERE. console.log('Last insert ID:', res.insertId);
		created_by : 9999, //req.body.createdBy ,//
		created_date : req.body.createdDate, //req.body.createdDate,
		updated_by : 9999, //req.body.updatedBy,
		updated_date : dateSys, //req.body.updatedDate,

	};
	var  replacingContent;
	replacingContent = req.body.emailTemplate.sourceCode.replace("*|BODYHEADER|*", req.body.emailTemplate.bodyHeader);
	replacingContent = replacingContent.replace("*|BODYSUBJECT|*", req.body.emailTemplate.bodySubject);
	replacingContent = replacingContent.replace("*|BODYCONTENT|*", req.body.emailTemplate.bodyContent);
	replacingContent = replacingContent.replace("*|BODYFOOTER|*", req.body.emailTemplate.bodyFooter);
	replacingContent = replacingContent.replace("*|APPNAME|*", req.body.emailTemplate.appName);
	replacingContent = replacingContent.replace("*|EMAILADDRESS|*",req.body.emailTemplate.emailAddress);
    console.log('replaced content is ', replacingContent);
	//template.modified_code  = replacingContent;
	var template = {
		template_sno     : req.body.emailTemplate.templateSno,
		base_template_id : req.body.emailTemplate.baseTemplateId,
		app_name         : req.body.emailTemplate.appName,
		email_address    : req.body.emailTemplate.emailAddress,
		email_subject    : req.body.emailTemplate.emailSubject,
		template_name    : req.body.emailTemplate.templateName,
		body_header      : req.body.emailTemplate.bodyHeader,
		body_subject     : req.body.emailTemplate.bodySubject,
		body_content     : req.body.emailTemplate.bodyContent,
		body_footer      : req.body.emailTemplate.bodyFooter,
		source_code      : req.body.emailTemplate.sourceCode,
		modified_code    : replacingContent,
		created_by       : 9999,
		created_date     : req.body.emailTemplate.createdDate,
		updated_by       : 9999,
		updated_date     : dateSys,
	};

	console.log("campaign object is ",campaign);
	console.log("template object is ", template);
	pool.query(updateTemplate, [ template.app_name, template.base_template_id,
			template.body_content, template.body_footer, template.body_header,
			template.body_subject, template.created_by, template.created_date,
			template.email_address, template.email_subject,
			template.modified_code, template.source_code,
			template.template_name, template.updated_by, template.updated_date,
			template.template_sno ], function(err, result) {
		if (err)
			throw err;
		console.log('Changed ' + result.changedRows + ' rows');
	});

	pool.query(updateCampaign,
			[ campaign.campaign_title, campaign.campaign_label,
					campaign.campaign_description, campaign.template_id,
					campaign.created_by, campaign.created_date,
					campaign.updated_by, campaign.updated_date,
					campaign.campaign_sno ], function(err, result) {
				if (err)
					throw err;
				console.log('Changed ' + result.changedRows + ' rows');
			});
};

module.exports.deleteCampaign = function(req, res) {
	var  campaignSno = req.params.campaignSno;
	console.log('campaign sno : ', campaignSno);
    var findCampaign = campaignSql.get('main.findCampaignQuery');
	//var findCampaign = "SELECT * FROM campaigns c, templates t WHERE c.campaign_sno = ? AND c.template_id = t.template_sno";
	var data = [];
	var query = pool.query(findCampaign,campaignSno, function(err, result) {
		if (err) {
			console.error(err);
			return;
		}
		var campaign = {
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
		
		// console.log("result data ", JSON.stringify(result));
		// res.send( JSON.stringify(result));

		for (var int = 0; int < result.length; int++) {
			campaign = new Object();
			template = new Object();

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

			campaign.campaignSno = result[int].campaign_sno;
			campaign.campaignTitle = result[int].campaign_title;
			campaign.campaignLabel = result[int].campaign_label;
			campaign.campaignDescription = result[int].campaign_description;
			campaign.emailTemplate = template;
			campaign.createdBy = result[int].created_by;
			campaign.createdDate = result[int].created_date;
			campaign.updatedBy = result[int].updated_by;
			campaign.updatedDate = result[int].updated_date;
			data.push(campaign);
		}
		
		//var deleteTemplate = "DELETE FROM templates WHERE template_sno = ?";
		var deleteTemplate = campaignSql.get('main.deleteTemplate');
		//var TemplateSno = data;
		var templateSno = template.templateSno;
		console.log('template sno is ', templateSno);
		pool.query(deleteTemplate, templateSno, function(err, result) {
			if (err)
				throw err;
			console.log('Deleted ' + result.affectedRows + ' rows');
			isBoolean = true;
			res.send (isBoolean);
		});
		
		//var deleteCampaign = "DELETE FROM campaigns WHERE campaign_sno = ? ";
		var deleteCampaign = campaignSql.get('main.deleteCampaign');
		pool.query(deleteCampaign, campaignSno, function(err, result) {
			if (err)
				throw err;
			console.log('Deleted ' + result.affectedRows + ' rows');
		});
		
		
		
	});
};

module.exports.findCampaign = function(findCampaign) {

	console.log("find all campaign controller called in server !!");
	var findCampaign = campaignSql.get('main.findCampaign');
	//var findCampaign = "SELECT * FROM campaigns WHERE campaign_sno=:campaign_sno";
	var data = [];
	var query = pool.query(findAllCampaigns, function(err, result) {
		if (err) {
			console.error(err);
			return;
		}
		var campaign = {
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
		//console.log("result data ", JSON.stringify(result));
		//res.send( JSON.stringify(result));

		for (var int = 0; int < result.length; int++) {
			campaign = new Object();
			template = new Object();

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

			campaign.campaignSno = result[int].campaign_sno;
			campaign.campaignTitle = result[int].campaign_title;
			campaign.campaignLabel = result[int].campaign_label;
			campaign.campaignDescription = result[int].campaign_description;
			campaign.emailTemplate = template;
			campaign.createdBy = result[int].created_by;
			campaign.createdDate = result[int].created_date;
			campaign.updatedBy = result[int].updated_by;
			campaign.updatedDate = result[int].updated_date;
			data.push(campaign);
		}
		deleteCampaign(data);
	});
};
