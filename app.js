
/**
 * Module dependencies.
 */

var express = require('express');

var routes = require('./routes');
var user = require('./routes/user');
var loginform = require('./routes/loginForm');
var createTemplate = require('./routes/createTemplate');


// form handlers
var createAccountHandler = require('./formHandlers/account_form');
var accountValidator = require('./formHandlers/account_validation');
var tamplateHandler = require('./formHandlers/template_handler');


var http = require('http');
var path = require('path');

var app = express();

// sessions & coockies
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));


// all environments
app.set('port', process.env.PORT || 3000);
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


// setup post requests
app.post('/acountForm',createAccountHandler.createAccount);
app.post('/loginform', accountValidator.checkAccount);
app.post('/closeSession', accountValidator.closeSessionForAccount);
app.post('/createDeStandaardTemplate', tamplateHandler.createDeStandaardTemplate);



// setup routing
app.get('/', routes.index);
app.get('/loginform', loginform.loginform);
app.get('/createDeStandaardTemplate', createTemplate.createDeStandaardTemplate);


// create HTTP server
var server  = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});


// setup Socket.io

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});


var yelp = require("yelp").createClient({
    consumer_key: "8jFI0Whqoyk_YDpZFs1KjQ",
    consumer_secret: "kBzgzxMzO9bIC5Aup6ZvzYMyMPI",
    token: "Lt_YPwFCH617X_4AUFGud5S-UuDOap1U",
    token_secret: "1hV1RPByupzxXT11uU9eMY2Q-AM"
});

// See http://www.yelp.com/developers/documentation/v2/search_api
yelp.search({term: "hotel", location: "Sint-Pieters-Leeuw, België", radius_filter:"5000"}, function(error, data) {
    console.log(error);
    console.log(data);
});



