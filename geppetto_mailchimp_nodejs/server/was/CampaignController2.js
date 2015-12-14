var pool = require('../config/database');

// Define a class like this
function campaignController(name, gender){

   // Add object properties like this
   this.name = name;
   this.gender = gender;
   
   console.log('name: ',this.name,'gender : ', this.gender);
   
}

// Add methods like this.  All Person objects will be able to invoke this
campaignController.prototype.findAllCampaigns = function(){
    console.log("find all campaign ");
    // Retrieving the all created campaigns
   var findAllCampaigns=select * from campaigns c join templates t on t.template_sno=c.template_id;
};

campaignController.prototype.findCampaign = function(){
	console.log("find campaign");
};

campaignController.prototype.createCampaign = function(){
	console.log("create ");
};
campaignController.prototype.updateCampaign = function(){
	console.log("update")
};
campaignController.prototype.deleteCampaign = function(){
	console.log("delete")
};


// Instantiate new objects with 'new'
var campaignObject = new campaignController("Bob", "M");

// Invoke methods like this
campaignObject.speak(); // alerts "Howdy, my name is Bob"