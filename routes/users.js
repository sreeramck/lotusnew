var express = require('express');
var router = express.Router();

var https = require('https');
var moment = require('moment');


/* GET Userlist page. */
router.get('/prodlist', function(req, res) {
	var db = req.db;
	db.collection('watchlist').find().toArray(function(err, items){
		//console.log(items);
		res.json(items);
	});
});

router.post('/addprod', function(req, res) {
	var db = req.db;
	db.collection('watchlist').insert(req.body, function(err, result){
		res.send(
			(err === null) ? { msg: '' } : { msg: err }
		);
	});
});


router.delete('/deleteuser/:id', function(req, res) {
	var db = req.db;
	var userToDelete = req.params.id;
	db.collection('watchlist').removeById(userToDelete, function(err, result) {
		res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
	});
});


router.get('/best/:id',function(req,res){
	
	var request = require('request');
	var searchProd = req.params.id;
	var options = {
		url: 'http://api.remix.bestbuy.com/v1/products(search='+searchProd+')?apiKey=2be878xcfkfqkxa5usbaum5b&format=json',
		headers: {
			'User-Agent': 'request'
		}
	};

	function callback(error, response, body) {
		if (!error && response.statusCode == 200) {
			var info = JSON.parse(body);
			//console.log(info);
			res.json(info);
		}
	}

	request(options, callback);
});



router.get('/ebay/:id',function(req,res){
	//console.log("ebay Entery!!!");
	var request = require('request');
	var searchProd = req.params.id;
	var options = {
		url: 'http://open.api.ebay.com/shopping?callname=FindPopularItems&responseencoding=JSON&appid=lotusbc03-842b-4aa3-b731-2f3f3165220&siteid=0&QueryKeywords='+searchProd+'&version=517',
		headers: {
			'User-Agent': 'request'
		}
	};

	function callback(error, response, body) {
		if (!error && response.statusCode == 200) {
			var info = JSON.parse(body);
			//console.log("ebay result");
			//console.log(info);
			res.json(info);
		}
	}

	request(options, callback);
});


router.get('/semantics/:id',function(req,res){
	///////////////////////////////////////////////////
	var request = require('request');
	var searchProd = req.params.id;
	
	
	var api_key = 'SEM39A9872020CF1E7F9E142554B35F6CC65';
	var api_secret = 'M2RlNGI0NzJkMWMzMzIyMjg2ZmE1ODM4NDlhYTE0NjY';
	var sem3 = require('semantics3-node')(api_key,api_secret);
 
 
 
	var info;
	sem3.products.products_field( "search", searchProd );
	sem3.products.get_products(
		function callback(err, products) {
			if (err) {
				console.log("Couldn't execute query: get_products");
				return;
			}   
			//console.log("Results of query:\n" + JSON.stringify( products )); 
			res.type('application/json');
			info = JSON.parse(products);
			//var results = JSON.stringify(info.sitedetails);
			console.log("Semantics result");
			console.log(info);
			//res.setHeader('Content-Type', 'application/json');
			
			res.json(info);
		}   
	);
	
	
	//request(options, callback);
});


router.post('/addWatch/:id', function(req, res) {
	console.log("Adding to watchlist!!!");
	
	var db = req.db;
	var request = require('request');
	var prodId = req.params.id;
	
	//var collection = db.get('watchlist');
	var options = {
		url: 'http://api.remix.bestbuy.com/v1/products(sku='+prodId+')?apiKey=2be878xcfkfqkxa5usbaum5b&format=json',
		headers: {
			'User-Agent': 'request'
		}
	};

	function callback(error, response, body) {
		if (!error && response.statusCode == 200) {
			var info = JSON.parse(body);
			console.log(info.products[0].name);
			console.log(info.products[0].sku);
			console.log(info.products[0].salePrice);
			console.log(info.products[0].priceUpdateDate);
			
			console.log('What the fuck');
			
			// var dump = { "name" : "Lenovo Laptop - Intel Pentium - 4GB Memory - 128GB Solid State Drive - Black",
			// 						 "sku" : 1996011,
			// 						 "salePrice" : 799.99,
			// 						 "priceUpdateDate" : "2014-08-10T00:01:12",
			// 						 "log" : [
				// 						 		{ "hPrice" : 799.99,
				// 								  "hTime" : "2014-10-05T00:01:33" }
				// 								  ]
				//		   };
				var dump = { "name" : info.products[0].name, 
				"sku" : info.products[0].sku, 
				"salePrice" : info.products[0].salePrice, 
				"priceUpdateDate" : info.products[0].priceUpdateDate, 
				"log" : [ 
					{ "hPrice" : info.products[0].salePrice, 
					"hTime" : info.products[0].priceUpdateDate } 
				] 
			};
			
			db.collection('watchlist').insert(dump, function (err, doc) {
				if (err) {
					console.log(err);
					// If it failed, return error
					res.send("There was a problem adding the information to the database.");
				}
				else {
					console.log('added successfully');
					res.send({msg: ''});
				}
			});
			
			// res.json(info);
		}
	}

	request(options, callback);
	
	
	
});





module.exports = router;
