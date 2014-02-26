
/*
 * GET home page.
 */

exports.index = function(req, res){

  console.log("Sesssion: "  + req.session.login);

 var currentLogin="";
  var state="Login";


  if(typeof req.session.login !== "undefined")
 {
      currentLogin = "Logged in as: " + req.session.login;
      state = "Log out";
  }
  res.render('index', { login: currentLogin,
                                 state: state
                               });

};
