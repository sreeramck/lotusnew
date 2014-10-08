var express = require('express');
var router = express.Router();

var https = require('https');
var moment = require('moment');


/* GET Userlist page. */
router.get('/prodlist', function(req, res) {
    var db = req.db;
    db.collection('watchlist').find().toArray(function(err, items){
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


router.post('/delprod/:id', function(req, res) {
    var db = req.db;
	var prodTodelete = req.params.id;
    db.collection('watchlist').removeById(prodTodelete, function(err, result){
        res.send((result === 1) ? { msg: '' } : { msg: 'error: '+ err });
    });
});


router.post('/best',function(req,res){
	//var request = require("request");
	req.get("http://api.remix.bestbuy.com/v1/products(search=mac)?format=json&show=sku,name,salePrice&apiKey=2be878xcfkfqkxa5usbaum5b",function(err,res,body){
		res.json(body);
	})
});





module.exports = router;
