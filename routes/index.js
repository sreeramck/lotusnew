var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
  res.render('helloworld', { title: 'Hello,World!!' });
});


/* GET Userlist page. */
router.get('/watchlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
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
    var pprice = req.body.price;

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "name" : pname,
        "price" : pprice
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
