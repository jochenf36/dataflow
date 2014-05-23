
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var timer = require('timer-ease'); // syntactic sugar for timer function
var colors = require('colors');
var app = module.exports = express();


// sessions & coockies
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));


// all environments
app.set('port', process.env.PORT || 3000);
app.set('host', process.env.HOST || '192.168.0.121');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());



// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}


// setup routing
var routes = require('./routes');

// create HTTP server
var server = http.createServer(app).listen(app.get('port'), app.get('host'), function(){
    console.log("Express server listening on ".green +app.get('host')+":" +app.get('port'));
});

var io = require('socket.io').listen(server);
io.set('browser client minification', true);  // send minified client

var RealtimeNotificationServer = require('.././dataflow/Crosslets/RealTimeNotificationServer');

RealtimeNotificationServer.setupServer();


