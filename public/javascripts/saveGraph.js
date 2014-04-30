function testExecution()
{
    console.log("test the executeion");
}


function saveGraph(dataflow,$)
{
    // to do save option for document

    console.log("Graph is being saved")
    var nodesModels = dataflow.currentGraph.nodes.models; // get all the nodes in the graph
    var edgesModels = dataflow.currentGraph.edges.models; // get all the nodes in the graph



    // clean the unncessary info;
    parseNodes(nodesModels, function(cleanNodes,filters){
        parseEdges(edgesModels, cleanNodes, function(cleanEdges){
            checkNewNodes($,cleanNodes,undefined, function()
            {
                checkNewEdges($,undefined, cleanEdges);
                if(filters.length>0)
                    parseFilters(filters)


            });
        });
    });


}

function parseNodes(rawNodesArray, callback)
{

    var cleanNodes= new Array();
    var filters = new Array();

    for (var i=0;i<rawNodesArray.length;i++)
    {
        var currentNode=rawNodesArray[i];

        var cleanNode= {};
        cleanNode.id = currentNode.id;
        cleanNode.type = currentNode.type;
        cleanNode.name = currentNode.attributes.label;
        cleanNode.state = currentNode.attributes.state;

        if(cleanNode.type=="Filter")
        {
            filters.push(currentNode);
        }


        cleanNodes.push(cleanNode);
    }


    callback(cleanNodes, filters);

}

function checkNewNodes($, currentNodes,filtername, callback)
{
    var uri = "../../getDocumentGraph";

    $.get(
        uri,
        function(data) {

            var nodesIserver = data.nodes;

            if(filtername===undefined)
            {
                nodesIserver = data.nodes;
            }else
            {
                nodesIserver = data.filters[filtername];
                console.log("Nodes in server for filter :", filtername, " Nodes: ", nodesIserver);
            }

            console.log("data from iServer: ", data);

            var listToDelete = new Array();
            var listToAdd = new Array();
            var listToCheck = new Array();

            var nodesStillThere = new Array();

            for(i in currentNodes)
            {
                var currentNode = currentNodes[i];

                var currentNodeName=currentNode.state.name;
                if(currentNodeName===undefined)
                {
                    // its a new node because its id in iServer is undefined
                    if(currentNode.type!= "dataflow-input" && currentNode.type!="dataflow-output")  // don't add the input and output ports of a subgraph
                        listToAdd.push(currentNode);
                }
                else{
                    // the node was already in the iServer so we have to check if it has changed
                    for(y in nodesIserver)
                    {
                        var iServerNode = nodesIserver[y];

                        var iServerNodeName = iServerNode.name;

                        if(currentNodeName==iServerNodeName)
                        {
                            nodesStillThere.push(y);
                            listToCheck.push({"currentNode":currentNode,"iServerNode": iServerNode});
                        }
                    }
                }
            }

            // check which nodes were deleted
            for(i in nodesIserver)
            {
                if(nodesStillThere.indexOf(i)==-1)
                {
                    listToDelete.push(nodesIserver[i] );
                }
            }

            // check if a nodes content was modified checked with iserver nodes
            console.log("listToCheck:",listToCheck);
            for(i in listToCheck)
            {
               var currentNode =  listToCheck[i].currentNode;
               var iServerNode =  listToCheck[i].iServerNode;
               compareNodes(currentNode,iServerNode);
            }

            console.log("List to add Nodes:", listToAdd);
            console.log("List to check Nodes:", listToCheck);
            console.log("List to Delete Nodes:", listToDelete);
            sendNewNodes(listToAdd,$,filtername, callback);
            sendDeleteNodes(listToDelete,listToAdd,$,filtername, callback);

        }
    );

}

function sendDeleteNodes(listToDelete,listToAdd,$, filtername, callback)
{

    for(var q=0; q<listToDelete.length; q++)
    {
        var item = listToDelete[q];

        var itemToDelete={};
        if(item.class!==undefined)
        {
            itemToDelete.type = item.class.substring(item.class.indexOf(".rsl")+5);
            itemToDelete.name = item.name;
            itemToDelete.filtername = filtername;

            console.log("Check if you may delete a node :", listToAdd, listToDelete)
            var add=true;
            for(i in listToAdd)
            {
                if(listToAdd[i].name==itemToDelete.description)
                {
                    add=false;
                }
            }
            if(add)
            {
                $.ajax({
                    url: '../../DeleteResource',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(itemToDelete)});
            }
        }
   }



}


function checkNewEdges($,filtername, currentEdges)
{
    var uri;
    if(filtername===undefined)
    {
        uri = "../../getDocumentGraph";
    }else
    {
        uri = "../../filter/:name="+filtername;
    }

            $.get(
            uri,
            function(data) {
                console.log("currentEdges: ", currentEdges);

                var edgesIserver = data.edges;
                console.log("Edges in iServer: ", edgesIserver);


                var listToDelete = new Array();
                var listToAdd = new Array();

                var edgesStillThere = new Array();

                for(i in currentEdges)
                {
                    var currentEdge = currentEdges[i];

                    var currentEdgeInput=currentEdge.input;
                    var currentEdgeOutput=currentEdge.output;

                    var newEdge=true;
                    // the edge was already in the iServer so we have to check if it has changed
                        for(y in edgesIserver)
                        {
                            var iServerEdge = edgesIserver[y];

                            // change it ... weird ..
                            var iServerEdgeInput = iServerEdge.output;
                            var iServerEdgeOutput = iServerEdge.input;

                            if(iServerEdgeInput==currentEdgeInput &&iServerEdgeOutput==currentEdgeOutput)
                            {
                                edgesStillThere.push(y);
                                newEdge=false;
                            }
                        }

                    if(newEdge)
                    {
                        if(filtername!==undefined)
                        {
                            currentEdge.filtername = filtername;
                        }
                        else{
                            currentEdge.filtername = undefined;
                        }
                        if(currentEdgeOutput!="in" || currentEdgeInput!="out")  // we don't want to store the edges to the of the filter
                        {
                            listToAdd.push(currentEdge);
                        }
                    }
                }

                // check which nodes were deleted
                for(i in edgesIserver)
                {
                    if(edgesStillThere.indexOf(i)==-1)
                    {
                        listToDelete.push(edgesIserver[i] );
                    }
                }


                console.log("List to add:", listToAdd);
                console.log("List to Delete:", listToDelete);

             sendNewEdges(listToAdd,$); // toevoegen om ze echt te verzenden!!!
             deleteEdges(listToDelete,$); // toevoegen om ze echt te verzenden!!!

            }
        );



}

function deleteEdges(toDelete, $)
{

    var deleteEdges={};

    // create the edges for deletion
    for(i in toDelete)
    {
        var edgeItem = toDelete[i];
        var edge={};

        edge.source = edgeItem.output;
        edge.target = edgeItem.input;
        edge.name = edge.source + "TO" + edge.target;
        deleteEdges[edge.name] = edge;
    }


    $.ajax({
        url: '../../deleteTubes',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(deleteEdges)});



}

function sendNewEdges(newEdgesList,$)
{
    var newEdges={};
    for(i in newEdgesList)
    {

        var edgeItem = newEdgesList[i];
        var edge={};

        edge.target = edgeItem.input;

        edge.source = edgeItem.output;

        edge.name = edge.source + "TO" + edge.target;

        edge.filtername = edgeItem.filtername;

        edge.visibileTo = edgeItem.visibleTo;

        if(edge.target!="out"&& edge.source!="in") // we don't want the artificial nodes of a filter
           newEdges[edge.name] = edge;
    }

    console.log("Send new Edges to server:", newEdges);


    $.ajax({
            url: '../../createNewTubes',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newEdges)});


}


// send new nodes of document to the iServer
function sendNewNodes(newNodesList,$, filtername,callback)
{
    if(newNodesList.length>0)
    {
          var result= {};
        result.filtername= filtername;


        var newNodes={};
        for(i in newNodesList)
        {
            console.log("New node check", i);
            var nodeItem = newNodesList[i];

            var node={};
            if(nodeItem.name == " ")
            {
                node.name = nodeItem.type;
            }
            else{
                node.name = nodeItem.name;

            }

            // if its a node of a filter add the title of the filter;
            if(filtername!==undefined)
            {
               node.filtername=filtername;
            }

            node.type = nodeItem.type;
            node.state = nodeItem.state;
            newNodes[node.name] =node;
        }

        result.nodes= newNodes

        console.log("Send New Nodes to server:", result);

        $.ajax({
                url: '../../createNewNodes',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(newNodes)}
            );

    }


    callback();

}

function compareNodes(currentNode,iServerNode)
{
    var type =  currentNode.type;

   // if(type==Placeholder) // ignore placeholders

    if(type=="TextComp") // what to check for textcomp
    {
        console.log("vergelijk:",currentNode,iServerNode);

        if(currentNode.content != iServerNode.state)
        {

        }
    }

}

function parseEdges(rawEdgesArray,cleanNodes, callback)
{

    var cleanEdges= new Array();

    console.log("raw edges: " , rawEdgesArray);

    for (i in rawEdgesArray)
    {
        var currentEdge=rawEdgesArray[i];

        var currentEdgeFullName = currentEdge.id;
        var output = currentEdgeFullName.substring(0,currentEdgeFullName.indexOf(":"));
        var input = currentEdgeFullName.substring(currentEdgeFullName.indexOf("::")+2,currentEdgeFullName.indexOf(":",currentEdgeFullName.indexOf("::")+2));

        var cleanEdge= {};


        for (var i=0;i<cleanNodes.length;i++)
        {
            var currentNode = cleanNodes[i];
            if(currentNode.id==output){
                cleanEdge.output = currentNode.state.name;  // get node by iServerName
                if(cleanEdge.output === undefined) // no IserverName yet (new node)
                {
                    cleanEdge.output = currentNode.name;
                }
                if(cleanEdge.output==" " || cleanEdge.output=="")
                {
                    cleanEdge.output = currentNode.type;
                }
            }

            if(currentNode.id==input)
            {
                cleanEdge.input = currentNode.state.name;  // get node by iServerName
                if(cleanEdge.input === undefined) // no IserverName yet (new node)
                {
                    cleanEdge.input = currentNode.name;
                }
            }
        }


        cleanEdge.name = "output:" + cleanEdge.output  + " AND input: "+ cleanEdge.input;

        cleanEdge.visibleTo = currentEdge.attributes.visibleTo; // get the visibility information from the edges

        cleanEdges.push(cleanEdge);
    }
    console.log("clean edges: " , cleanEdges);

    callback(cleanEdges);

}

function parseFilters(filters)
{

    for(i in filters)
    {
        var filter={};
        var filterItem = filters[i];

        if(filterItem.attributes.state.name===undefined){
            filter.name = filterItem.attributes.label;
        }
        else
        {
           // get the iServer name
            filter.name = filterItem.attributes.state.name
        }
      //  console.log("Filteritem: ", filter);

        var filterNodes = filterItem.graph.nodes.models; // get all the nodes in the graph
        var filterEdges = filterItem.graph.edges.models; // get all the nodes in the graph


        // clean the unncessary info;
        parseNodes(filterNodes, function(cleanNodes,newfilters){

            if(newfilters.length>0)
            {
                parseFilters(newfilters)
             //   console.log("Filter in a Filter!");

            }

            parseEdges(filterEdges, cleanNodes, function(cleanEdges){
                checkNewNodes($,cleanNodes,filter.name, function()
                {
                    checkNewEdges($,filter.name, cleanEdges);
                });
            });
        });

    };



}