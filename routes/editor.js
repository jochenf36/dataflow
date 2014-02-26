
/*
 * GET debug page.
 */

exports.editor = function(req, res){

    console.log("Got on editor Page: "  + req.session.login);


    res.render('editor', {});

};
