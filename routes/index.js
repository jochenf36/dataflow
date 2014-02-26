
/*
 * GET home page.
 */

exports.index = function(req, res){

  res.render('index', { login: currentLogin,
                                 state: state
                               });

};
