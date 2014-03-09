function testExecution()
{
    console.log("test the executeion");
}


function parseNodes(rawNodesArray, callback)
{

    var cleanNodes= new Array();

    for (var i=0;i<rawNodesArray.length;i++)
    {
        var currentNode=rawNodesArray[i];

        var cleanNode= {};
        cleanNode.id = currentNode.id;
        cleanNode.type = currentNode.type;
        cleanNode.name = currentNode.attributes.label;
        cleanNode.state = currentNode.attributes.state;

        cleanNodes.push(cleanNode);
    }


    callback(cleanNodes);

}

function checkNewNodes($, currentNodes, callback)
{
    $.get(
        "../../getDocumentGraph",
        function(data) {
            console.log("currentNodes: ", currentNodes);

            var nodesIserver = data.nodes;
            console.log("Nodes in iServer: ", nodesIserver);

            var listToDelete = new Array();
            var listToAdd = new Array();
            var listToModify = new Array();
            var listToCheck = new Array();

            var nodesStillThere = new Array();

            for(i in currentNodes)
            {
                var currentNode = currentNodes[i];

                var currentNodeName=currentNode.state.name;
                if(currentNodeName===undefined)
                {
                    // its a new node because its id in iServer is undefined
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
            sendNewNodes(listToAdd,$, callback);
         }
    );

}





function checkNewEdges($, currentEdges)
{

        $.get(
            "../../getDocumentGraph",
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
                        listToAdd.push(currentEdge);
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

        newEdges[edge.name] = edge;
    }

    console.log("Send to server:", newEdges);


    $.ajax({
            url: '../../createNewTubes',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newEdges)});

}


// send new nodes of document to the iServer
function sendNewNodes(newNodesList,$,callback)
{
    var newNodes={};
    for(i in newNodesList)
    {
        var nodeItem = newNodesList[i];

        var node={};
        node.name = nodeItem.name;
        node.type = nodeItem.type;
        node.state = nodeItem.state;
        newNodes[node.name] =node;
    }

    console.log("Send to server:", newNodes);

    $.ajax({
            url: '../../createNewNodes',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newNodes)}
        );

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

        cleanEdges.push(cleanEdge);
    }
    console.log("clean edges: " , cleanEdges);

    callback(cleanEdges);

}