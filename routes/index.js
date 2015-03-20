	var express = require('express');
	var router = express.Router();

	/* GET home page. */
	router.get('/', function(req, res) {
		res.render('index', { title: 'Express' });
	});

	module.exports = router;

	/* GET Userlist page. */
	router.get('/contactslist', function(req, res) {
		var db = req.db;
		var collection = db.get('users');
		collection.find({},{"sort" : [['name.last', 'asc']]},function(e,docs){
			res.render('contactslist', {
				"contactslist" : docs
			});
		});
	}); 
	/*Get edit contact*/
	router.get('/edit/:ID', function(req, res){
		var db = req.db;
		var collection = db.get('users');
		collection.findOne({_id: req.params.ID}, function(err, contact){
			res.render('editcontact', {
				"user":contact
			});
		});
	});


	//POST to edit contact
	router.post('/editcontact/:ID', function(req,res){
		var db= req.db;
		var collection = db.get('users');
		if(req.body.button == "no"){
			res.location("/contactslist");
			res.redirect("/contactslist");
		} else {

  // Get form values
  var firstName = req.body.fname;
  var lastName = req.body.lname;
  var title = req.body.title;
  var company = req.body.company;
  var email = req.body.email;
  var whereMet = req.body.wheremet;
  var dateMet = req.body.datemet;
  var comments = req.body.comments;

  collection.update(
  	{_id: req.params.ID},
  	{
  		"name" : {"first": firstName, "last" : lastName},
  		"title": title,
  		"company": company,
  		"email": email,
  		"wheremet": whereMet,
  		"datement": dateMet,
  		"comments": comments
  	},function(err){
  		if(err){
  			res.send(err);
  		} else {
  			res.location("/contactslist");
  			res.redirect("/contactslist");
  		}
  	});
}

});

	/* GET delete contact */
	router.get('/delete/:ID', function(req, res){
		var db = req.db;
		var collection = db.get('users');
		collection.findOne({_id: req.params.ID}, function(err, contact){
			res.render('deletecontact', {
				"user":contact
			});
		});
	});

	/* POST to delete */
	router.post('/deletecontact/:ID', function(req,res){
		var db= req.db;
		var collection = db.get('users');
		if(req.body.button == "no"){
			res.location("/contactslist");
			res.redirect("/contactslist");
		} else {
			collection.remove(
				{_id: req.params.ID},
				{
					this: true  
				},function(err){
					if(err){
						res.send(err);
					} else {
						res.location("/contactslist");
						res.redirect("/contactslist");
					}
				});
		}
	});

	/* GET New User page. */
	router.get('/addcontact', function(req, res) {
		res.render('addcontact', { title: 'Add Contact', message: '',errors: {} });
	});

	/* POST to Add User Service */
	router.post('/addcontact', function(req,res){


 //validator
 req.assert('fname', 'First name is empty!').notEmpty();
 req.assert('lname', 'Last name is empty!').notEmpty();
 req.assert('email', 'Email is invalid').isEmail();
 
 var dateMet = req.body.datemet;
//Check to see if date is empty
if(!dateMet){
	var today = new Date();
	var day = today.getDate();
  var month = today.getMonth()+1; //January is 0!
  var year = today.getFullYear();

  if(day<10) {day='0'+day} 

  	if(month<10) {month='0'+month} 

  		dateMet = month+'/'+day+'/'+year;


  } else {
  	req.assert('datemet', dateMet).isDate({format: 'DD-MM-YYYY'});
  }

  var errors = req.validationErrors();
  if(!errors){
  //No errors than pass validation
  var db = req.db;

 // Get form values
 var firstName = req.body.fname;
 var lastName = req.body.lname;
 var company = req.body.company;
 var title = req.body.title;
 var email = req.body.email;
 var whereMet = req.body.wheremet;
 var comments = req.body.comments;
  //Set Collection
  var collection = db.get('users');
 //Check to see if date is empty and put today's date
 
 
 //Submit to DB
 collection.insert({
 	"name" : {"first": firstName, "last" : lastName},
 	"title": title,
 	"company": company,
 	"email": email,
 	"wheremet": whereMet,
 	"datement": dateMet,
 	"comments": comments
 }, function (err, doc){
 	if(err){
         //returns error if failed
         res.send("There was a problem adding the information to the database.")
     }
     else {
     	//changes the url
     	res.location("contactslist");
     	//goes to the contactslist page
     	res.redirect("contactslist");
     }
 });
} else {
  //Display errors
  res.render('addcontact', 
  	{ title: 'Add Contact',
  	message: 'Insert all required fields',
  	errors :errors,
  	firstName: req.body.fname
  });
}


});


	module.exports = router;