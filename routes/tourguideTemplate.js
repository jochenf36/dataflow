
/*
 * GET Tourguide templat.
 */


app = require('../app');


app.get('/tourguideTemplate',function(req, res){
    var document_name = req.session.currentDocumentName;

    res.render('tourguideTemplate', { link: "/editor/:name="+document_name
    });


});


