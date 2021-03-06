var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var stormpath = require('express-stormpath');



// New Code
var mongo = require('mongoskin');
//var monk = require('monk');
//var db = mongo.db("mongodb://localhost:27017/lotusnew",{native_parser:true});

//mongolab database
var db = mongo.db("mongodb://sreeramck:password123@ds039960.mongolab.com:39960/lotusnew",{native_parser:true});




var routes = require('./routes/index');
var users = require('./routes/users');


var app = express();

// app.use(stormpath.init(app, {
//    apiKeyId:     process.env.STORMPATH_API_KEY_ID,
//    apiKeySecret: process.env.STORMPATH_API_KEY_SECRET,
//    secretKey:    process.env.STORMPATH_SECRET_KEY,
//    application:  process.env.STORMPATH_URL,
//  }));


// app.use(stormpath.init(app, {
//     // apiKeyId:     process.env.STORMPATH_API_KEY_ID,
// //     apiKeySecret: process.env.STORMPATH_API_KEY_SECRET,
// //secretKey:    process.env.STORMPATH_SECRET_KEY,
//     application:  process.env.STORMPATH_URL,
//   }));

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
