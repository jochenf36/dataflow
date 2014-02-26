
/*
 * GET debug page.
 */

exports.debug = function(req, res){

    console.log("Got on Debug Page: "  + req.session.login);


    res.render('debug', {});

};
