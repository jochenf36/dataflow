
// Contains all the Webservice requests to the iServer

var request = require('request');

function getURI()
{
    return "http://localhost:9998/iserver/";  // default URI PART
}


exports.createUser = function createUser(login_name, callback){

        // create user object
        var userJson= {
            "description" : login_name+"'s account",
            "login" : login_name,
            "password" : "test"
        };


        //define URI
        var uri = getURI() + 'individuals/' + login_name
        console.log("Send POST : " + uri);


        // if the entered username does not exist, create the user  with default password test
        request(
            { method: 'POST'
                , uri: uri
                , json:userJson
            }
            , function (error, response, body) {
                if(response.statusCode == 200){ // should be 201 but not good implemented at IServer (200 = OK , 201 = ADDED)
                    console.log('User has been created');

                } else {
                    console.log('error: '+ response.statusCode)
                    console.log('body'+ body)
                }
                callback();
            }
        )

}

// checks whether or not the user already exists.
exports.getUser = function getUser(login_name,callback)
{

    //define URI
    var uri = getURI() + 'users'
    console.log("Send GET : " + uri);


    // make request and check whether user already exists or not
    request(
        { method: 'GET'
            , uri: uri
        }
        , function(error, response, body) {
        if(response.statusCode == 200){

            var jsonObjectUsers=  JSON.parse(body); // because the result is an array and it needs to be coverted to a json object
            if(jsonObjectUsers.hasOwnProperty(login_name))
            {
                console.log('User request succeeded -> user found');

                callback(jsonObjectUsers[login_name][0]); // return the retrieved user
            }
            else
            {
                console.log('User request -> user not found');
                callback(undefined);
            }


        } else {
            console.log('error: '+ response.statusCode)
            console.log('body'+ body)
        }
    });
}


// checks whether or not the user already exists.
exports.getDocument = function getDocument(document_name,callback)
{
    //define URI

    var uri =getURI() + 'documenttemplates/' + document_name
    console.log("Send GET : " + uri);


    // get document from iServer
    request(
        { method: 'GET'
            , uri: uri
        }
        , function(error, response, body) {
            if(response.statusCode == 200){

                var jsonObjectDocument=  body;
                    callback(jsonObjectDocument); // return the retrieved user
                }
                else
                {
                    console.log('Docmuent not found');
                    callback(undefined);
                }

        });

}


// checks whether or not the user already exists.
exports.getNode = function getDocument(nodeName, type,callback)
{
    // needs to be converted
    if(type==="textComp")
    {
        type = "text";
    }

    //define URI
    var uri =getURI() + 'resources/' + type + "/" + nodeName;
    console.log("Send GET : " + uri);


    // get document from iServer
    request(
        { method: 'GET'
            , uri: uri
        }
        , function(error, response, body) {
            if(response.statusCode == 200){

                var jsonObject=  body;
                callback(jsonObject); // return the retrieved user
            }
            else
            {
                console.log('jsonObject not found');
                callback(undefined);
            }

        });

}



// get placeholder by name
exports.getPlaceholder = function getPlaceholder(placeholder_name,callback)
{

    //define URI
    var uri = getURI() + 'placeholders/' + placeholder_name;
    console.log("Send GET : " + uri);


    // get placeholder from iServer
    request(
        { method: 'GET'
            , uri: uri
        }
        , function(error, response, body) {
            if(response.statusCode == 200){

                var jsonObjectPlaceholder=  body;
                callback(jsonObjectPlaceholder); // return the retrieved user
            }
            else
            {
                console.log('Placeholder not found');
                callback(undefined);
            }

        });

}



// create Document Template object
exports.createDocumentTemplate = function createDocumentTemplate(document_name,document_description, user_name, callback)
{

    // create document object

    var documentJson={
        creator:user_name,
        name:document_name,
        description:document_description
    }


    //define URI
    var uri = getURI() + 'documenttemplates/' + document_name
    console.log("Send POST : " + uri);

    // if the entered username does not exist, create the user  with default password test
    request(
        { method: 'POST'
            , uri: uri
            , json:documentJson
        }
        , function (error, response, body) {
            if(response.statusCode == 200){ // should be 201 but not good implemented at IServer (200 = OK , 201 = ADDED)
                console.log('Document Template has been created');

            } else {
                console.log('error: '+ response.statusCode)
                console.log('body'+ body)
            }
            callback();
        }
    )

}



// create resource object
exports.createResource  = function createResource(resoureName,type ,jsonData)
{
    //define URI
    var uri = getURI() + "resources/" + type +'/' + resoureName
    console.log("Send POST : " + uri, jsonData);

    request(
        { method: 'POST'
            , uri: uri
            , json:jsonData
        }
        , function (error, response, body) {
            if(response.statusCode == 200){ // should be 201 but not good implemented at IServer (200 = OK , 201 = ADDED)
                console.log('Resource has been created');

            } else {
                console.log('error: '+ response.statusCode)
                console.log('body'+ body)
            }
        }
    )
}
// create resource object
exports.deleteResource  = function createResource(resourceName,type)
{
    //define URI
    var uri = getURI() + "resources/" + type +'/' + resourceName;
    console.log("Send Delete : " + uri);

    request(
        { method: 'DELETE'
            , uri: uri
        }
        , function (error, response, body) {
            if(response.statusCode == 200){ // should be 201 but not good implemented at IServer (200 = OK , 201 = ADDED)
                console.log('Resource has been deleted: ', resourceName);

            } else {
                console.log('error: '+ response.statusCode)
                console.log('body'+ body)
            }
        }
    )
}

// create Placeholder object

exports.createPlaceholder = function createPlaceholder(placeholder_name, placeholder_description)
{

    //create placeholder object
    var placeholderJSON={
        name :placeholder_name,
        description : placeholder_description
    }


    //define URI
    var uri = getURI() + 'placeholders/' + placeholder_name
    console.log("Send POST : " + uri);


    request(
        { method: 'POST'
            , uri: uri
            , json:placeholderJSON
        }
        , function (error, response, body) {
            if(response.statusCode == 200){ // should be 201 but not good implemented at IServer (200 = OK , 201 = ADDED)
                console.log('Placeholder has been created: ', placeholder_name);

            } else {
                console.log('error: '+ response.statusCode)
                console.log('body'+ body)
            }
        }
    )
}

exports.addPlaceholdersToTemplate = function addPlaceholdersToTemplate(placeholders, document_name)
{

    var placeholderJSON={
        name :document_name,
        placeholders : placeholders
    }

    request(
        { method: 'PUT'
            , uri: getURI() + 'documenttemplates/addPlaceholders/' + document_name
            , json:placeholderJSON
        }
        , function (error, response, body) {
            if(response.statusCode == 200){ // should be 201 but not good implemented at IServer (200 = OK , 201 = ADDED)
                console.log('Placeholders added to document');

            } else {
                console.log('error: '+ response.statusCode)
                console.log('body'+ body)
            }
        }
    )
}

// get placeholder by name
exports.getDocuments = function getDocuments(callback)
{

    //define URI
    var uri = getURI() + 'documenttemplates'
    console.log("Send GET : " + uri);


    // get documents from iServer
    request(
        { method: 'GET'
            , uri: uri
        }
        , function(error, response, body) {
            if(response.statusCode == 200){

                var jsonObjectDocuments=  body;
                callback(jsonObjectDocuments); // return the retrieved user
            }
            else
            {
                console.log('Documents not found');
                callback(undefined);
            }

        });

}



// get placeholder by name
exports.getTubes = function getTubes(callback)
{

    //define URI
    var uri = getURI() + 'collectionTubes'
    console.log("Send GET : " + uri);


    // get collectionTubes from iServer
    request(
        { method: 'GET'
            , uri: uri
        }
        , function(error, response, body) {
            if(response.statusCode == 200){

                var jsonObjectTubes=  body;
                callback(jsonObjectTubes); // return the retrieved user
            }
            else
            {
                console.log('collection tubes not found');
                callback(undefined);
            }

        });

}
