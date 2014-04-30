
// Contains all the Webservice requests to the iServer

var request = require('request');

app = require('../app');

function getURI()
{
    return "http://"+app.get("host")+":9998/iserver/";  // default URI PART

    //return "http://localhost:9998/iserver/";  // default URI PART
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
                    console.log('error: '+ response.statusCode, "User was not created: ", login_name);
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
            console.log('error: '+ response.statusCode, "User not found: ", login_name);
            console.log('body'+ body)
        }
    });
}


// get the document
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
                    console.log('Document not found: ', document_name);
                    callback(undefined);
                }

        });

}



// get a node from the iServer (any type of resource actually)
 exports.getNode = function getNode(nodeName, type,callback,counter)
{

    console.log("Get node:", nodeName, " of type:", type);
    // needs to be converted
    if(type==="textComp")
    {
        type = "text";
    }
    // needs to be converted
    if(type==="WebService")
    {
        type = "Webservice";
    }

    //define URI
    var uri =getURI() + 'resources/' + type + "/" + nodeName;

    if((type==="Placeholder" ||type==="placeholder"  )){
        uri = getURI() + 'placeholders/' + nodeName;

    }

    // get document from iServer
    request(
        { method: 'GET'
            , uri: uri
        }
        , function(error, response, body) {
            if(response.statusCode == 200){
                var jsonObject=  body;

                if(counter!==undefined)
                {
                    callback(jsonObject, counter); // return the retrieved user

                }else
                {

                   callback(jsonObject); // return the retrieved user
                }
            }
            else
            {

                console.log('Node not found:', nodeName, error);
                callback(undefined);
            }

        });

}


// get a node from the iServer (any type of resource actually)
exports.deleteNode = function deleteNode(nodeName, type,callback)
{
    // needs to be converted
    if(type==="textComp"|| type==="TextComp")
    {
        type = "text";
    }

    //define URI
    var uri =getURI() + 'resources/' + type + "/" + nodeName;
    console.log("Send Delete : " + uri);


    // delete node from iServer
    request(
        { method: 'DELETE'
            , uri: uri
        }
        , function(error, response, body) {
            if(response.statusCode == 200){

                var jsonObject=  body;
                callback(response.statusCode); // return the retrieved user
            }
            else
            {
                console.log('Node not found:', nodeName);
                callback(response.statusCode);
            }

    });
}

exports.deleteNodeFromFilterElements = function deleteNodeFromFilterElements(name, type, filtername)
{
    // needs to be converted
    if(type==="textComp"|| type==="TextComp")
    {
        type = "text";
    }

    var jsonData ={elementName: name};

    //define URI
    var uri = getURI() + "Filter/deleteelement/"+ filtername;
    console.log("Send PUT : " + uri, jsonData);

    request(
        { method: 'PUT'
            , uri: uri
            , json:jsonData
        }
        , function (error, response, body) {
            if(response.statusCode == 200){ // should be 201 but not good implemented at IServer (200 = OK , 201 = ADDED)
                console.log('Element is removed from filter');
            } else {
                console.log('error: '+ response.statusCode, " For: ", " removing element to filter:", elementName)
               // console.log('body'+ body)
            }
        }
    )


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
                console.log('error: '+ response.statusCode, " For: ", "creating DocumentTemplate", document_name)
                console.log('body'+ body)
            }
            callback();
        }
    )

}



// create resource object
exports.createResource  = function createResource(resoureName,type ,jsonData,callback)
{
    resoureName = resoureName.replace(/\s+/g, '_');

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
                console.log('Resource has been created:', resoureName);
                if(callback!==undefined)
                {
                    console.log("Now call callback for", resoureName)
                    callback(resoureName);
                }
            } else {
                console.log('error: '+ response.statusCode, " For: ", "creating resource:", resoureName)
                console.log('body'+ body)
            }
        }
    )
}
// delete resource object
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
                console.log('error: '+ response.statusCode, " For: ", "deleting resource: ", resourceName)
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
                console.log('error: '+ response.statusCode, " For: ", "Adding ", placeholder_name)
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
                console.log('error: '+ response.statusCode, " For: ", "Adding placeholders to template")
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
  //  console.log("Send GET : " + uri);


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
                console.log('error: '+ response.statusCode, " For: ", "Adding placeholders to template")
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
 //   console.log("Send GET : " + uri);


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


// add element to filter
exports.addElementToFilter  = function addElementToFilter(elementName,filtername)
{

    var jsonData ={elementName: elementName};

    //define URI
    var uri = getURI() + "Filter/addelement/"+ filtername;
    console.log("Send PUT : " + uri, jsonData);

    request(
        { method: 'PUT'
            , uri: uri
            , json:jsonData
        }
        , function (error, response, body) {
            if(response.statusCode == 200){ // should be 201 but not good implemented at IServer (200 = OK , 201 = ADDED)
                console.log('Element is added to filter');
            } else {
                console.log('error: '+ response.statusCode, " For: ", " adding element to filter:", elementName)
                console.log('body'+ body)
            }
        }
    )
}