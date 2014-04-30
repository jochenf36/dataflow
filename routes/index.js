
/*
 * GET home page.
 */



app = require('../app');
var iServer = require('../iServer/iServerAPI');
var tourguideTemplate = require('../routes/tourguideTemplate');


app.get('/',function(req, res){

    tourguideTemplate.deactivatePage();

    var templateLinks = new Array(); // will hold the links of all the available templates
    // Templatelinks prototype
    function Templatelink(name, link)
    {
        this.name = name;
        this.link = link;
    }

    var tourguide = new Templatelink("Tour Guide", "/newTourguideDetails");

    templateLinks.push(tourguide);

    var existingUser = req.session.existingUser;
    var currentUser = req.session.currentUser;


    if(existingUser!==undefined)  // if a new user was created we have to show a message that it succeeded
    {

        delete req.session.existingUser // delete for the next possible created user

        console.log("send res :", existingUser);
        loadExistingDocuments(function(documentLinks){

            res.render('index', { templateLinks: templateLinks,
                documentLinks: documentLinks,
                existingUser:existingUser});

        })

    }
    else
    {
        loadExistingDocuments(function(documentLinks){

console.log("CurrentUser :", currentUser);

            res.render('index', { templateLinks: templateLinks,
                documentLinks: documentLinks,
                currentUser:currentUser
                });

        })
    }



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

            documentLinks.push(new DocumentLink(name,description, "/tourguideTemplate/:name="+name));

        }

        console.log("documents:" +documentLinks);

        callback(documentLinks);
    });
}

// other links
require('./tourguideTemplate');
require('./editor');
require('./newTourguideDetails');
require('./FormHandler'); // will take care of all the incoming forms
require('./createUser');