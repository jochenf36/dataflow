
/*
 * GET home page.
 */



app = require('../app');


app.get('/createUser',function(req, res){

    var currentUser = req.session.currentUser;

    res.render('createUser', {
        currentUser:currentUser
    });
});
