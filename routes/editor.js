
/*
 * GET document editor page.
 */





app = require('../app');

var async = require('async');

var iServer = require('../iServer/iServerAPI');



app.get('/editor',function(req, res){

    var name = req.param('name');

    console.log( req.params);

    var currentUsername = req.session.currentUser;
    var documentName = req.session.currentDocumentName;


    console.log("Current User in Cookie: "+currentUsername);
    console.log("Current document name in Cookie: "+documentName);

    res.render('editor', {});

});




app.get('/editor/:name',function(req, res){

    var name = req.param('name').substring(req.param('name').indexOf("=")+1);



    req.session.currentDocumentName=  name;

    var documentName = req.session.currentDocumentName;

    console.log("Current document name in Cookies: "+documentName);

    res.render('editor', {});


});

// get the placeholders for the current document
function getPlaceholders(documentName, callback)
{
    var placeholderArray = new Array();

    iServer.getDocument(documentName,function(jsonObjectDocument){
    var arrayPlaceholders = JSON.parse(jsonObjectDocument).placeholders;

        var counter=0;
        async.whilst(function () {
                return counter < arrayPlaceholders.length;
            },
            function (next) {
                var fullnamePlaceholder = arrayPlaceholders[counter];
                var placeholderName = fullnamePlaceholder.substring(fullnamePlaceholder.indexOf(":")+1,fullnamePlaceholder.indexOf("]")); // just get the name of the placeholder

                iServer.getPlaceholder(placeholderName,function(jsonObjectPlaceholder){
                placeholderArray.push(JSON.parse(jsonObjectPlaceholder));


                counter++;
                next();
                });

                },
            function (err) {
                // All things are done!
                callback(placeholderArray);
            });

    });
};



// create New nodes for current document in the iServer
app.post('/createNewNodes',function(req, res){
    var nodes=  req.body;

    for (var key in nodes) {
           var node=  nodes[key];

            var resourceName = req.session.currentDocumentName + "_"  + node.name;  // concat for uniquness

            var resourceType = "";
            var resourceData ={};

            if(req.session.currentUse===undefined)
            {
                resourceData.creator = "Jochen" // default user  if no current user
            }
            else
            {
                resourceData.creator = req.session.currentUser;
            }

        console.log("Nodes incomming:", node.state);
        resourceData.description = node.name;

        if(node.type=="TextComp")
            {
                resourceType = "text";
                resourceData.content = node.state.content;
            }


        iServer.createResource(resourceName,resourceType ,resourceData);
    };

    res.send(200);
});


app.post('/deleteTubes',function(req, res){

    var tubes=  req.body;
    console.log("Delete Tubes:", tubes);

    for (var key in tubes) {
        var tube=  tubes[key];

        var tubeName = req.session.currentDocumentName +tube.name;

        iServer.deleteResource(tubeName,"tubes");

    };
    res.send(200);

});

// create New nodes for current document in the iServer
app.post('/createNewTubes',function(req, res){
    var tubes=  req.body;
    console.log("New Tubes:", tubes);

    for (var key in tubes) {
        var tube=  tubes[key];


        var resourceType = "tubes";
        var resourceData ={};

        if(req.session.currentUse===undefined)
        {
            resourceData.creator = "Jochen" // default user  if no current user
        }
        else
        {
            resourceData.creator = req.session.currentUser;
        }

        if(tube.source.indexOf(req.session.currentDocumentName + "_" )==-1)
        {
            resourceData.source =  req.session.currentDocumentName + "_"  + tube.source;
        }
        else
        {
            resourceData.source =  tube.source;

        }

        if(tube.target.indexOf(req.session.currentDocumentName + "_" )==-1)
        {
            resourceData.target =  req.session.currentDocumentName + "_"   + tube.target;
        }
        else
        {
            resourceData.target =  tube.target;

        }

        var resourceName = req.session.currentDocumentName + resourceData.target  +"TO"+resourceData.source;  // concat for uniquness


        iServer.createResource(resourceName,resourceType ,resourceData);

    };
    res.send(200);

});


// get the placeholders for the current document
function getNode(nodeName,type, callback)
{

    iServer.getNode(nodeName,type,function(jsonObject){
        var node = JSON.parse(jsonObject);
        callback(node);
    });

};



app.get('/getDocumentGraph', function(req, res){

    var documentName = req.session.currentDocumentName;


    var graph = {} // start with an empty graph to hold the document


    var nodes = new Array();  // empty array of nodes (nodes are components)
    var edges = new Array();  // empty array of edges (edges are tubes)


    graph.nodes = nodes;
    graph.edges = edges;

        // first get all the placeholders (everything starts from these nodes)
        getPlaceholders(documentName, function(placeholderArray)
        {

            var counterPlaceholders=0;
            async.whilst(function () {
                return counterPlaceholders < placeholderArray.length;
            },
            function (nextPlaceholders) {
                var placeholder =  placeholderArray[counterPlaceholders];

                    nodes.push(placeholder);
                    setConnectedNodes(placeholder.name, nextPlaceholders, edges, nodes);  // get all the nodes connected to the placeholders
                    counterPlaceholders++;

                },function (err) {
                // All things are done!
                    console.log("Json send");
                    res.json(graph);
            });

        });
});

// set all the nodes connected to this node and add the to the list of nodes (by using the tube system)
function setConnectedNodes(nodeName, nextFunction, edges, nodes)
{
    // get the outgoing tubes for all the placeholders
    getOutgoingTubes(nodeName, function(connectedTubes){

        var counter=0;
        async.whilst(function () {
                return counter < connectedTubes.length;
            },
            function (next) {

                var edge={};
                edge.input = connectedTubes[counter].input;
                edge.inputType = connectedTubes[counter].typeInput;
                edge.output = connectedTubes[counter].output;
                edge.outputType = connectedTubes[counter].typeOutput;

                console.log("Edge:" , edge);

                edges.push(edge);

                // get the tubes connected to this node;

                var name=  connectedTubes[counter].input;
                var type=  connectedTubes[counter].typeInput;
                getNode(name,type, function(node){

                    node.type = node.class.substring(node.class.indexOf(".rsl")+5);  // the classname will be the type of the node

                    //console.log("Node added:", node);
             //       console.log("Verzameling: ", nodes);

                    var alreadyInCollection = false;
                    for(i in nodes)
                    {
                        var otherNode = nodes[i];
                        if(otherNode.name === node.name)
                        {
                            alreadyInCollection = true
                        }
                    }
                    counter++;

                    if(!alreadyInCollection){
                        nodes.push(node);
                        console.log("Testing!!!!");
                        setConnectedNodes(node.name,function(){
                            next();
                        }, edges,nodes);

                        console.log("Node name:" ,node.name);
                    }
                    else
                    {
                        next();
                    }

                })
            },
            function (err) {
                // All things are done!
                nextFunction();
            });

    });
}

// get all the tubes that are inputted in the node
function getOutgoingTubes(nodeID, callback)
{

    console.log("Current nodeID request tubes: " + nodeID);


    iServer.getTubes(function(jsonObjectTubes){

        var tubeArray = new Array();

        var tubeJSON =  JSON.parse(jsonObjectTubes); // parso to json


        for(tube in tubeJSON){

            var filteredTube ={};  // going to contain the tube connected to the nodeID

            var full_output = tubeJSON[tube][0].target[0]; // needs to be converted
            var full_input = tubeJSON[tube][0].source[0]; // needs to be converted


            var output="";
            if(full_output.indexOf("|")!=-1)
                output = full_output.substring(full_output.indexOf(":")+1,full_output.indexOf("|"));
            else
                output = full_output.substring(full_output.indexOf(":")+1,full_output.indexOf("]"));

            var input="";
            if(full_input.indexOf("|")!=-1)
                input = full_input.substring(full_input.indexOf(":")+1,full_input.indexOf("|"));
            else
                input = full_input.substring(full_input.indexOf(":")+1,full_input.indexOf("]"));


            filteredTube.typeOutput = full_output.substring(1,full_output.indexOf(":"));
            filteredTube.output= output;
            filteredTube.typeInput = full_input.substring(1,full_input.indexOf(":"));
            filteredTube.input= input;

            console.log("Filtered Tube checking in: " , filteredTube.input ,"out:",  filteredTube.output);

            if(filteredTube.output===nodeID)
            {
                console.log("Filtered Tube Added: " , filteredTube);

                tubeArray.push(filteredTube);

            }


        }
        callback(tubeArray);

        // console.log("Filtered Tube: " , tubeArray);



//   console.log("Get my tubes:" , JSON.parse(jsonObjectTubes).tube2[0].output);
        //var arrayTubes = JSON.parse(jsonObjectTubes).placeholders;

    });

};

