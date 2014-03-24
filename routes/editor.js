
/*
 * GET document editor page.
 */





app = require('../app');

var async = require('async');

var iServer = require('../iServer/iServerAPI');
var tourguideTemplate = require('../routes/tourguideTemplate');



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


    console.log("Current document name in Cookies: "+req.session.currentDocumentName);

    res.render('editor', {});


    tourguideTemplate.deactivatePage();

});

// get the placeholders for the current document
exports.getPlaceholders = getPlaceholders;

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

        var resourceData ={};
        var resourceType = "";

        if(node.type=="TextComp")
            {
                resourceType = "text";
                resourceData.content = node.state.content;
            }

        if(node.type=="Current Location")
         {
             resourceType = "CurrentLocation";
           //  delete resourceData.description;
             node.name = node.name.replace("_","");
             resourceData.updateFrequency = node.state["Update Frequency (milliseconds)"];

         }

        if(node.type=="Location")
        {
            resourceType = "Location";
            node.name = node.name.replace("_","");
            resourceData.latitude = node.state.latitude;
            resourceData.longitude = node.state.longitude;
        }

        if(node.type=="Range Filter")
        {
            resourceType = "RangeFilter";
            node.name = node.name.replace("_","");
            resourceData.Max = node.state.Max;
            resourceData.Min = node.state.Min;
        }

        if(node.type=="Web Service")
        {
            resourceType = "Webservice";
            resourceData.name = node.name.replace("_","");
            resourceData.consumerKey = node.state["Consumer Key (optional)"];
            resourceData.consumerSecret = node.state["Consumer Secret (optional)"];
            resourceData.searchTerm = node.state["Search Terms  (name:value)"];
            resourceData.tokenKey = node.state["Token Key (optional)"];
            resourceData.tokenSecret = node.state["Token Secret (optional)"];
            resourceData.uri = node.state["URI OR Name"];
            resourceData.updateFrequency = node.state["Update Frequency (milliseconds)"];

            for(item in resourceData)
            {
                if(resourceData[item]===undefined)
                {
                    resourceData[item]= "";
                    if(item=="updateFrequency")
                        resourceData[item]= 0;


                }
            }

        }



        if(node.type=="Filter")
        {
            resourceType = "Filter";
        }

        var resourceName;

            resourceName = req.session.currentDocumentName + "_"  + node.name;  // prefix document name for uniqueness



        if(req.session.currentUser===undefined)
            {
                resourceData.creator = "Jochen" // default user  if no current user
            }
        else
            {
                resourceData.creator = req.session.currentUser;
            }

        console.log("Nodes incomming:", node.state);
        resourceData.description = node.name;


        if(node.filtername===undefined)
        {
            iServer.createResource(resourceName,resourceType ,resourceData);
        }
        else
        {
            if(node.filtername.indexOf(req.session.currentDocumentName)==-1)
            {
                node.filtername= req.session.currentDocumentName + "_"+ node.filtername;
            }

            iServer.createResource(resourceName,resourceType ,resourceData, function(name){
                // it its an element belong to a filter add it to the elements of the filter
                iServer.addElementToFilter(name,node.filtername); // filtername toevoegen ?
            });
        }

    };

    res.send(200);
});


app.post('/deleteTubes',function(req, res){

    var tubes=  req.body;
   // console.log("Delete Tubes:", tubes);

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
   // console.log("New Tubes:", tubes);

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

        resourceData.target =  resourceData.target.replace(/\s+/g, '_');
        resourceData.source =  resourceData.source.replace(/\s+/g, '_');

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

// get a filter by name
app.get('/filter/:name',function(req, res){

    var filtername = req.param('name').substring(req.param('name').indexOf("=")+1);

    iServer.getNode(filtername,"Filter",function(jsonObject){
        if(jsonObject!==undefined)
        {
            var filter = JSON.parse(jsonObject);
          //  console.log("Retreived Filter: ",filter);
            res.send(filter);
        }
        else{
          //  console.log("No filter found for: ",filtername);
            res.send(200);
        }

    });


});


// get a resource by name and type and delete it
app.post('/DeleteResource',function(req, res){

    var element=  req.body;

    var name = req.param('name').substring(req.param('name').indexOf("=")+1);

    var type = req.param('type').substring(req.param('type').indexOf("=")+1);

    if(filtername!==undefined)
     var filtername = req.param('filtername').substring(req.param('filtername').indexOf("=")+1);


    iServer.deleteNode(name, type,function(statusCode){
            if(statusCode==200)
            {
                console.log("Resource deleted ",name);
            }
            else
                console.log("Resource could not be deleted", name);

            res.send(200);
        }
    );

    if(filtername!==undefined && filtername!="")
    {
        iServer.deleteNodeFromFilterElements(name, type, filtername,function(statusCode){
                if(statusCode==200)
                {
                    console.log("Resource deleted from associated Filters",resource);
                }
                else
                    console.log("Resource could not be deleted from associated Filters", resource);

                res.send(200);
            }
        );
    }


});

// get a resource by name and type
app.get('/resource/:name/:type',function(req, res){

    var name = req.param('name').substring(req.param('name').indexOf("=")+1);

    var type = req.param('type').substring(req.param('type').indexOf("=")+1);




    iServer. getNode(name, type,function(jsonObject){
        if(jsonObject!==undefined)
        {
            var resource = JSON.parse(jsonObject);
            console.log("Resource retrieved ",resource);
            res.send(resource);
        }
        else{
            console.log("No resource found for: ",name , " with type: ", type);
            res.send(200);
        }
    })


});


// add  element to filter
app.get('/addTofilter/:name',function(req, res){

    var filtername = req.param('name').substring(req.param('name').indexOf("=")+1);


    iServer.getNode(filtername,"Filter",function(jsonObject){
        if(jsonObject!==undefined)
        {
            var filter = JSON.parse(jsonObject);
            console.log("Retreived Filter: ",filter);
            res.send(filter);
        }
        else{
            console.log("No filter found for: ",filtername);
            res.send(200);
        }
    });
});





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
                    addFilterElementsToGraph(graph, res);
            });

        });
});

function addFilterElementsToGraph(graph, res)
{
    var counterNodes=0;
    var nodes= graph.nodes;

    graph.filters ={};

    var filters = graph.filter;

   async.whilst(function () {
        return counterNodes < nodes.length;
    },
       function(next)
       {
            var node= nodes[counterNodes];

            var isFilter=false;
            if(node.type=="Filter")
            {
                isFilter=true;
                var elements = node.elements;


                graph.filters[node.name]= new Array();

                var elementsCounter=0;
                async.whilst(function () {
                    return elementsCounter < elements.length;
                },
                function(next)
                {
                    var element = elements[elementsCounter];
                    var elementName

                    if(element.indexOf("|")==-1)
                    {
                        elementName = element.substring(element.indexOf(":")+1,element.indexOf("]"));
                    }
                    else{
                        elementName = element.substring(element.indexOf(":")+1,element.indexOf("|"));
                    }
                    var elementType = element.substring(1,element.indexOf(":"));

                    console.log("Element of filter: ", elementType, elementName);

                    iServer.getNode(elementName,elementType,function(jsonObject){
                        if(jsonObject!==undefined)
                        {
                            var element = JSON.parse(jsonObject);

                            graph.filters[node.name].push(element);

                        }
                        else{
                      //      console.log("element filter found for: ",elementName);
                        }
                        elementsCounter++;
                        next();
                    });
                } ,
               function (err) {
                   // All things are done!
                   counterNodes++;
                   next();

               });

            }

           if(!isFilter)
           {
               counterNodes++;
               next();
           }

       },
        function (err) {
            // All things are done!
        //   console.log("Send the Graph to client", graph);
            getTubesForFilters(res,graph);

    });


}


// get tubes of filterelements;
function getTubesForFilters(res,graph)
{
    var filters= graph.filters;

    var filterNames =new Array();


    for(i in filters)
    {
        filterNames.push(i);

    }

    var filterCounter=0;
    async.whilst(function () {
        return filterCounter < filterNames.length;
    },
    function(nextFilter)
    {
        var elements = filters[filterNames[filterCounter]];

        var elementCounter=0;
        async.whilst(function () {
            return elementCounter < elements.length;
        },
        function(nextElement)
        {
            var element = elements[elementCounter];
            getOutgoingTubes(element.name, function(tubeArray,nodeID){

                for(var j in tubeArray)
                {
                    var tube  = tubeArray[j];

                    graph.edges.push(tube);
                }

                elementCounter++
                nextElement();
            });
        },
        function(err)
        {
             // All things are done!
            filterCounter++;
            nextFilter();
        });



    },
    function(err)
    {
        // All things are done!
        res.json(graph);
    });

}




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


                edges.push(edge);

                // get the tubes connected to this node;

                var name=  connectedTubes[counter].input;
                var type=  connectedTubes[counter].typeInput;
                getNode(name,type, function(node){

                if(node.class!==undefined)
                {
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


                }
                    else{
                    alreadyInCollection=true;
                }

                    if(!alreadyInCollection){
                        nodes.push(node);
                        setConnectedNodes(node.name,function(){
                            next();
                        }, edges,nodes);

                     //   console.log("Node name:" ,node.name);
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

  // console.log("Current nodeID request tubes: " + nodeID);


    iServer.getTubes(function(jsonObjectTubes){

        var tubeJSON =  JSON.parse(jsonObjectTubes); // parse to json

        var tubeArray = new Array();

        for(tube in tubeJSON){

            var filteredTube ={};  // going to contain the tube connected to the nodeID

            var full_output = tubeJSON[tube][0].target[0]; // needs to be converted
            var full_input = tubeJSON[tube][0].source[0]; // needs to be converted


            if(full_input!=null && full_output!=null)
            {

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


                if(filteredTube.output===nodeID)
                {
                   // console.log("Filtered Tube Added: " , filteredTube);

                    tubeArray.push(filteredTube);

                }
            }
        }
        callback(tubeArray,nodeID);

    });

};

