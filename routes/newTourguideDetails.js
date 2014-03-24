
/*
 * GET the form to enter the detailf for  a new tourguide.
 */


app = require('../app');


app.get('/newTourguideDetails',function(req, res){

    res.render('newTourguideDetails', {});

});

