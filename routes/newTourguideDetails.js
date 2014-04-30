
/*
 * GET the form to enter the detailf for  a new tourguide.
 */


app = require('../app');


app.get('/newTourguideDetails',function(req, res){


    var currentUser = req.session.currentUser;


    res.render('newTourguideDetails', {currentUser:currentUser});

});

