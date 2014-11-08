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
			console.log(info);
	        res.json(info);
	    }
	}

	request(options, callback);
});





module.exports = router;
