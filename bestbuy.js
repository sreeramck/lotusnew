var https = require('https');
var moment = require('moment');

 
/**
 * HOW TO Make an HTTP Call - GET
 */
// options for GET
var optionsget = {
    host : 'api.remix.bestbuy.com', // here only the domain name
    // (no http/https !)
    port : 443,
    path : '/v1/products(sku=5012276)?show=name,sku,salePrice,priceUpdateDate&format=json&apiKey=2be878xcfkfqkxa5usbaum5b', // the rest of the url with parameters if needed
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
	    console.log("statusCode: ", res.statusCode);
	    // uncomment it for header details
	//  console.log("headers: ", res.headers);
 
 
	    res.on('data', function(d) {
	        //console.info('GET result:\n');
	       // process.stdout.write(d);
			
			var obj = JSON.parse(d);
			
			console.log(obj.products[0].name);
			console.log(obj.products[0].salePrice);			
			console.log(obj.products[0].priceUpdateDate);			
			// $.each(obj, function(){
				
				
			// });
	        //console.info('\n\nCall completed');
	    });
 
	});
 
	reqGet.end();
	reqGet.on('error', function(e) {
	    console.error(e);
	});
},5000)

 
// do the GET request
