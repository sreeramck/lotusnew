var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');




// New Code
var mongo = require('mongoskin');
//var monk = require('monk');
var db = mongo.db("mongodb://localhost:27017/lotusnew",{native_parser:true});


db.createCollection('watchlist', function(err, collection){
	   if (err) throw err;

	   	console.log("Created testCollection");
	 		console.log(collection);
			populateDB();
			console.log("db populated");
	});



//////////rProduction db////////////
/*
var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});


db = new Db('lotusnew', server, {safe: true});


db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'lotusnew' database");
        db.collection('watchlist', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'product' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});
*/
var populateDB = function() {

    var products = [{
		"name" : "Nikon - D3200 DSLR Camera with 18-55mm VR Lens - Black",
		"sku" : 4826999,
		"salePrice" : 479.99,
		"priceUpdateDate" : "2014-10-05T00:01:33",
		"log" :[
			{ 
			"hPrice" : 479.99,
			"hTime" : "2014-10-05T00:01:33"
			}
		]
	},
	{
		"name" : "Whirlpool - 3.8 Cu. Ft. 12-Cycle High-Efficiency Top-Loading Washer - White",
		"sku" : 1537112,
		"salePrice" : 449.99,
		"priceUpdateDate" : "2014-10-05T00:01:33",
		"log" :[
			{ 
			"hPrice" : 449.99,
			"hTime" : "2014-10-05T00:01:33"
			}
		]
	},
	{
		"name" : "Garmin - vívofit Fitness Band - Purple",
		"sku" : 5258039,
		"salePrice" : 129.99,
		"priceUpdateDate" : "2014-10-05T00:01:33",
		"log" :[
			{ 
			"hPrice" : 129.99,
			"hTime" : "2014-10-05T00:01:33"
			}
		]
	},
	{
		"name" : "Samsung - 40\" Class (40\" Diag.) - LED - 1080p - 60Hz - HDTV",
		"sku" : 5012276,
		"salePrice" : 429.99,
		"priceUpdateDate" : "2014-10-05T00:01:33",
		"log" :[
			{ 
			"hPrice" : 429.99,
			"hTime" : "2014-10-05T00:01:33"
			}
		]
	},
	{
		"name" : "Sony - VAIO 11.6\" 2-in-1 Touch-Screen Laptop - Intel Pentium - 4GB Memory - 128GB Solid State Drive - Black",
		"sku" : 1996011,
		"salePrice" : 799.99,
		"priceUpdateDate" : "2014-08-10T00:01:12",
		"log" :[
			{ 
			"hPrice" : 799.99,
			"hTime" : "2014-10-05T00:01:33"
			}
		]
	}
	];

    db.collection('watchlist', function(err, collection) {
        collection.insert(products, {safe:true}, function(err, result) {});
    });

};


//////////////////////////////////

var routes = require('./routes/index');
var users = require('./routes/users');


var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});


app.use('/', routes);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
