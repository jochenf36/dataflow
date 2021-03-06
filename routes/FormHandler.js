
/*
 * GET document editor page.
 */



var iServer = require('../iServer/iServerAPI');

app = require('../app');


// form handler for tour guide details
app.post('/tourguideDetailsForm',function(req, res){

    // get variables from form
    var login_name= req.session.currentUser;
    var document_name=  req.body.documentname;
    document_name = document_name.split(' ').join('');

    var document_description=  req.body.description;

    console.log("Document Name:" +document_name);

    // set the current user in a session ( a new user is created if he/she does not exists in the iServer)
    function storeCurrentUserAndCreateTourguide(newUser){

        if(newUser === undefined)
        {
            iServer.createUser(login_name, function()// create new user if he does not exist
            {
                iServer.getUser(login_name,storeCurrentUserAndCreateTourguide);
            });
        }
        else
        {
            req.session.currentUser = newUser.name; // save current user in session

            req.session.currentDocumentName = document_name; // save current document name in session

            // create the tourguide on th iserver
            iServer.createDocumentTemplate(document_name,document_description, login_name, function(){



                createPlaceholderforTourGuide(document_name, function(){
                    res.redirect('/tourguideTemplate');             // redirect to the page to view the tour guide template

                });

            } );

        }
    };


    iServer.getUser(login_name,storeCurrentUserAndCreateTourguide);


    // create placeholders for a tourguide and add them to the document template
    function createPlaceholderforTourGuide(document_name,callback)
    {
        var placeholderArray = Array(); // holds all the placeholders

        var sizeArray = new Array(0,1,2,3,4,5,6);


        sizeArray.forEach(function(i) {
            var placeholder_name = document_name+"_"+ "Placeholder" + i;
            var placeholder_description = "";

            switch(i)
            {
                case 0:
                    placeholder_description = "O - Title";
                    break;
                case 1:
                    placeholder_description = "1 - Weather";
                    break;
                case 2:
                    placeholder_description = "2 - Temperature";
                    break;
                case 3:
                    placeholder_description = "3 - Information";
                    break;
                case 4:
                    placeholder_description = "4 - POI";
                    break;
                case 5:
                    placeholder_description = "5 - Events";
                    break;
                case 6:
                    placeholder_description = "6 - Map";
                    break;
                default:
                    placeholder_description = "empty"
            }


            placeholderArray.push(placeholder_name);
            iServer.createPlaceholder(placeholder_name ,placeholder_description);
        });

      //  iServer.addPlaceholdersToTemplate(placeholderArray,document_name);

        callback();
    }

});

app.post('/createUserForm',function(req, res){


    // get variables from form
    var login_name=  req.body.login;

    var existingUser = true;
    // set the current user in a session ( a new user is created if he/she does not exists in the iServer)
    function storeCurrentUserAndCreateTourguide(newUser){

        if(newUser === undefined)
        {
            iServer.createUser(login_name, function()// create new user if he does not exist
            {
                existingUser=false;
                iServer.getUser(login_name,storeCurrentUserAndCreateTourguide);
            });
        }
        else
        {
            req.session.existingUser = existingUser;

            res.redirect('/');

        }
    };


    iServer.getUser(login_name,storeCurrentUserAndCreateTourguide);

});

app.post('/loginUser',function(req, res){


    // get variables from form
    var login_name=  req.body.user;


    console.log("Loginnam :",login_name);
    iServer.getUser(login_name,function(returnValue)
    {
          if(returnValue===undefined)
          {
              res.send("errors");
          }
          else
          {
              req.session.currentUser = login_name; // save current user in session
              res.send("no_errors");
          }
    });

});




app.get('/logout',function(req, res){


    delete req.session.currentUser // delete current user from session
    res.send("no_errors")

});
