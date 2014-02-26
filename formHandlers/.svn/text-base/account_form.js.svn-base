
/*
 * Handle Account creation form
 */

exports.createAccount = function(req, res){

  account = {
    "name" : req.body.name,
    "login" : req.body.login,
    "password" : req.body.password,
    "description" : req.body.description || "",
    "usertype" : req.body.usertype
  }

  console.log("Account created: "+ account);

// TO DO: Create account in iServer


// Redirect to homepage
 res.redirect('/');
 res.end()

};
