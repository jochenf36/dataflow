
/*
 * GET home page.
 */



app = require('../app');
var iServer = require('../iServer/iServerAPI');


app.get('/',function(req, res){


    var templateLinks = new Array(); // will hold the links of all the available templates
    // Templatelinks prototype
    function Templatelink(name, link)
    {
        this.name = name;
        this.link = link;
    }

    var tourguide = new Templatelink("Tour Guide", "/newTourguideDetails");

    templateLinks.push(tourguide);


    loadExistingDocuments(function(documentLinks){

        res.render('index', { templateLinks: templateLinks,
                              documentLinks: documentLinks
                             });



    })



});


// load all the existing document en return them in an array
function loadExistingDocuments(callback)
{

    // Templatelinks prototype
    function DocumentLink(name,description, link)
    {
        this.name = name;
        this.description = description;

        this.link = link;
    }

    iServer.getDocuments(function(result){
        var resultJSON = JSON.parse(result);

        var documentLinks = new Array(); // will hold the links of all the available templates

        for (var key in resultJSON) {
           var name = resultJSON[key][0].name;
            var description = resultJSON[key][0].description;

            documentLinks.push(new DocumentLink(name,description, "/editor/:name="+name));

        }

        console.log(documentLinks);

        callback(documentLinks);
    });
}

// other links
require('./tourguideTemplate');
require('./editor');
require('./newTourguideDetails');
require('./FormHandler'); // will take care of all the incoming forms
