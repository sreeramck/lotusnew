var express = require('express');
var router = express.Router();

var https = require('https');
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'LOTUS' });
  
  
  
  var optionsget = {
      host : 'api.remix.bestbuy.com', // here only the domain name
      // (no http/https !)
      port : 443,
      path : '/v1/products(sku=4826999)?show=name,sku,salePrice,priceUpdateDate&format=json&apiKey=2be878xcfkfqkxa5usbaum5b', // the rest of the url with parameters if needed
      method : 'GET' // do GET
  };
 
  console.info('Options prepared:');
  console.info(optionsget);
  console.info('Do the GET call');


  setInterval(function(){
  	var now = moment();
  	console.log("*******************************************");
  	console.log(now.format());
  	var reqGet = https.request(optionsget, function(res) {
  	    //console.log("statusCode: ", res.statusCode);
  	    // uncomment it for header details
  		//  console.log("headers: ", res.headers);
 
 
  	    res.on('data', function(d) {
  	        //console.info('GET result:\n');
  	       // process.stdout.write(d);
			
  			var obj = JSON.parse(d);
			
  			console.log("Name: ",obj.products[0].name);
  			console.log("Price: ",obj.products[0].salePrice);			
  			console.log("Price Changed on: ",obj.products[0].priceUpdateDate);	
			console.log("Last updated time: ",now.format());		
  			
		/*	router.post('/', function(req, res) {
		    
			var db = req.db;
			var collection = db.get('watchlist');
			   // Submit to the DB
			   collection.update(
					{sku:obj.products[0].sku},
					{'$push':
					 	{	
						 "log": 
						 {
							 "hPrice":obj.products[0].salePrice,
							 "hTime":now.format()
						 }
					 	}
				 	}, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /addprod
            res.location("watchlist");
            // And forward to success page
            res.redirect("watchlist");
        }
    });	
			}); */
  			
  	    });
 
  	});
 
  	reqGet.end();
  	reqGet.on('error', function(e) {
  	    console.error(e);
  	});
  },1000*20)
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
  res.render('helloworld', { title: 'Hello,World!!' });
});


/* GET Userlist page. */
router.get('/watchlist', function(req, res) {
    var db = req.db;
    var collection = db.get('watchlist');
    collection.find({},{},function(e,docs){
        res.render('watchlist', {
            "watchlist" : docs
        });
    });
});

router.get('/newproduct', function(req, res) {
    res.render('newproduct', { title: 'Add New Product' });
});


/* POST to Add User Service */
router.post('/addprod', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var pname = req.body.name;
    var pprice = req.body.salePrice;

    // Set our collection
    var collection = db.get('watchlist');

    // Submit to the DB
    collection.insert({
        "name" : pname,
        "salePrice" : pprice
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /addprod
            res.location("watchlist");
            // And forward to success page
            res.redirect("watchlist");
        }
    });
});


module.exports = router;
