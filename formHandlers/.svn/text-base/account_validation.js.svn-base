
/*
 * Handle Account creation form
 */

exports.checkAccount = function(req, res){
accountCredentials = {

    "login" : req.body.login,
    "password" : req.body.password,

  }
  console.log("Account Credentials: "+ accountCredentials);

// set session object
 req.session.login = req.body.login;

 res.redirect("/");

};


exports.closeSessionForAccount = function(req, res){


  console.log("Session Closed");

// set session object
req.session.login = null // Deletes the cookie.

 res.redirect("/");

};

