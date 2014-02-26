
/*
 * GET loginform page.
 */

exports.loginform = function(req, res){


 var currentLogin="";
  var state="Login";


  if(typeof req.session.login !== "undefined")
 {
      currentLogin = "Logged in as: " + req.session.login;
      state = "Log out";
  }
  res.render('loginform', { login: currentLogin,
                                 state: state
                               });
};
