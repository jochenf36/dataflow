/*
 * Handle Template Forms
 */

var http = require('http');

exports.createDeStandaardTemplate = function(req, res){

  template = {
    "name" : req.body.name,
    "login" : req.body.login,
    "password" : req.body.password,
    "description" : req.body.description || "",
    "usertype" : req.body.usertype
  }

  console.log("Title created: "+  req.body.title);
  console.log("Intro created: "+  req.body.intro);
  console.log("Paragraph0 created: "+  req.body.paragraph0);
var jsondata=JSON.stringify( req.body);
  console.log("Alles created: "+jsondata);



// TO DO: Create template in iServer


var user = {
"description" : "Jochen's account",
"login" : "Jochen F",
"password" : "testJochen"
}


var userString = JSON.stringify(user);

var headers = {
  'Content-Type': 'application/json',
  'Content-Length': userString.length
};

var options = {
  host: 'localhost',
  port: 9998,
  path: '/iserver/individuals/Jochen',
  method: 'POST',
  headers: headers
};

// Setup the request.  The options parameter is
// the object we defined above.
var req = http.request(options, function(res) {
  res.setEncoding('utf-8');

  var responseString = '';

  res.on('data', function(data) {
    responseString += data;
    console.log("iServerResponse: " + responseString);
  });

  res.on('end', function() {
    var resultObject = JSON.parse(responseString);
  });
});

req.write(userString);
req.end();


// Redirect to homepage
 res.redirect('/');
 res.end()

};

