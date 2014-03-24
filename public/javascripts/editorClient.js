var nodecounter=0; // keeps track of all the nodes, also used to assign id to a node

var edgecounter=0; // keeps track of all the nodes, also used to assign id to a node

//  eliminate underscore and capitalize first letter
function makePretty(string)
{
    var res = string.replace(/_/g, ' ');

    return res.charAt(0).toUpperCase() + res.slice(1);
}

// the full document graph from the server
 function getDocumentGraph(anom, resultNodes, resultEdges, callback)
{
    anom.get(
        "../../getDocumentGraph",
        function(data) {

          console.log("Full document graph: ", data);

            createGraph(data, resultNodes,resultEdges,callback,anom);

        }
    );
}


function createGraph(graph, resultNodes,resultEdges, callback,$)
{
    var nodes =  graph.nodes;
    var edges =  graph.edges;
    var filters =  graph.filters;

    createNodes(nodes,filters,edges, resultNodes, function(nodes){

            createEdges(edges,nodes, resultEdges,function()
            {
                callback();
            });


    },$);


}

function createEdges(edges,nodes, resultEdges,callback)
{


    for(i in edges)
    {
        var edge = edges[i];


        var outputNodeName = edge.output;
        var inputNodeName = edge.input;

        linkNodes(nodes);


        function linkNodes(nodes){
            for(j in nodes){
                var targetnode = nodes[j];

                if(targetnode.state!== undefined && outputNodeName===targetnode.state.name)
                {

                    for(y in nodes){
                        var sourceNode = nodes[y];

                        if(sourceNode.state!== undefined && inputNodeName===sourceNode.state.name)
                        {
                            var outputPort = "output";
                            var inputPort = "input";

                            if(sourceNode.type=="Filter")
                            {
                                outputPort=sourceNode.graph.nodes[1].id;
                            }

                            if(targetnode.type=="Filter")
                            {
                                inputPort=targetnode.graph.nodes[0].id;
                            }

                            resultEdges[edgecounter]= {source:{node:sourceNode.id, port:outputPort}, target:{node:targetnode.id, port:inputPort}, route:0};
                            edgecounter++;
                        }
                    }
                }
            }
        }

    }

    console.log("Edges created:", resultEdges);

    callback();
}

function typeConverter(type)
{
    if(type == "RangeFilter")
        return "Range Filter";

    if(type == "WebService")
        return "Web Service";

    if(type == "CurrentLocation")
        return "Current Location";

        return type;
}

function createNodes(nodes,filters,edges, resultNodes,callbackWithNodesDone,$)
{

    var maxItemsOnRow=4;
    var x = 200;
    var y = 90;
    var width = 250;
    var height = 180;

    var maxItemsOnRow=4;

    for(i in nodes)
    {
        var currentNode = nodes[i];

        currentNode.type  = currentNode.class.substring(currentNode.class.indexOf(".rsl")+5);

        currentNode.type = typeConverter(currentNode.type);

        // determine max amount of items on one row
        var res=i%maxItemsOnRow;
        if(res==0&& i!=0){
            x = 50;
            y = y +  height + 50;
        }


        var temp =nodecounter;

        var currentLocationID;

        if(currentNode.type=="Filter")
        {
            var filterElements= filters[currentNode.name];

            var filterNodes= new Array();

            var filterEdges= new Array();

            var dataflowInputID = resultNodes.length+1;
            var dataflowOutputID = resultNodes.length+2;


            filterNodes.push({id: dataflowInputID, label: "in", type:"dataflow-input",  x:120, y: 150});
            filterNodes.push({id:dataflowOutputID, label:"out", type:"dataflow-output", x:1080, y:150});

            var xFilter =320;
            var yFilter= 100 * filterElements.length;

            for(i in filterElements)
            {
                var filterElement =  filterElements[i];


                if(filterElement.class!==undefined)
                {
                    filterElement.type  = filterElement.class.substring(currentNode.class.indexOf(".rsl")+5);

                    filterElement.type = typeConverter(filterElement.type);

                    var idFilterNOde = temp+i+i;
                    console.log("Filternode type:", filterElement.type);
                    if(filterElement.type == "Current Location")
                        currentLocationID= idFilterNOde;

                    var filterNode = {id:idFilterNOde, label:filterElement.description, type:filterElement.type,state:{
                        content:filterElement.content,
                        latitude:filterElement.latitude,
                        longitude:filterElement.longitude,
                        name:filterElement.name,
                        Max: filterElement.max,
                        Min: filterElement.min,
                        "Consumer Key (optional)":filterElement.consumerKey,
                        "Consumer Secret (optional)":filterElement.consumerSecret,
                        "Token Key (optional)":filterElement.tokenKey,
                        "Token Secret (optional)":filterElement.tokenSecret,
                        "Search Terms  (name:value)":filterElement.searchTerm,
                        "URI OR Name":filterElement.URI,
                        "Update Frequency (milliseconds)":filterElement.updateFrequency},
                        x:xFilter,
                        y:yFilter};

                    filterNodes.push(filterNode);

                        /* Currently leave out support for filters in filters
                            graph:{
                                nodes:[
                                    {id: resultNodes.length+1, label: "in", type:"dataflow-input",  x:180, y: 100},
                                    {id:resultNodes.length+2, label:"out", type:"dataflow-output", x:975, y:100}
                                ]
                            }
                            */

                    xFilter = xFilter+width+30;
                }


            }




            var controlInNodes={};
            var controlOutNodes={};

            for( a in filterNodes)
            {
                var filterNode =filterNodes[a];
                if(filterNode.state!==undefined) // not the input or output nodes of a subgraph
                {
                    var idNode = filterNode.id;
                    controlInNodes[filterNode.state.name] = {"value":false, "id":filterNode.id};
                    controlOutNodes[filterNode.state.name] = {"value":false, "id":filterNode.id};
                }
            }

            for( i in filterNodes)
            {
                var filterNodeIN= filterNodes[i];

                if(filterNodeIN.state!==undefined)  // not the input or output nodes of a subgraph
                {

                   for(j in edges){
                       var edge = edges[j];
                       if(edge.input==filterNodeIN.state.name)
                       {
                           console.log("Found match forIN: ", filterNodeIN.state.name, " AND :" ,edge);
                           for( m in filterNodes)
                           {
                               var filterNodeOut =filterNodes[m];
                               if(filterNodeOut.state!==undefined) // not the input or output nodes of a subgraph
                               {
                                   if(edge.output==filterNodeOut.state.name)
                                   {

                                       var outputPort = "output";
                                       var inputPort = "input";

                                       controlInNodes[filterNodeOut.state.name].value=true;
                                       controlOutNodes[filterNodeIN.state.name].value=true;

                                       if(currentLocationID!==undefined)
                                       {
                                        if(filterNodeIN.id==currentLocationID)
                                        {
                                            controlInNodes[filterNodeOut.state.name].value=false;
                                        }
                                       }

                                       filterEdges.push({source:{node:filterNodeIN.id, port:outputPort}, target:{node:filterNodeOut.id, port:inputPort}, route:1});
                                   }
                               }

                           }
                       }
                   }

                }
            }

            console.log("ControleInNodes: ", controlInNodes, "ControleOutNOdes: ", controlOutNodes);
            for(var i in controlInNodes)
            {
                var element =controlInNodes[i];
                var otherelement =controlOutNodes[i];


                if(element.value==false && otherelement.value==false )
                {
                    filterEdges.push({source:{node:dataflowInputID, port:"data"}, target:{node:element.id, port:"input"}, route:1});

                }
                if(element.value==false && otherelement.value==true )
                {
                    filterEdges.push({source:{node:dataflowInputID, port:"data"}, target:{node:element.id, port:"input"}, route:1});

                }

            }
            for(var i in controlOutNodes)
            {
                var element =controlOutNodes[i];
                var otherelement =controlInNodes[i];

                if(element.value==false && otherelement.value==false )
                {
                    filterEdges.push({source:{node:element.id, port:"output"}, target:{node:dataflowOutputID, port:"data"}, route:1});

                }
                if(element.value==false && otherelement.value==true )
                {
                    filterEdges.push({source:{node:element.id, port:"output"}, target:{node:dataflowOutputID, port:"data"}, route:1});

                }
            }



            resultNodes[resultNodes.length]= {id:temp, label:currentNode.description, type:currentNode.type,state:{
                content:currentNode.content,
                latitude:currentNode.latitude,
                longitude:currentNode.longitude,
                name:currentNode.name,
                Max: currentNode.max,
                Min: currentNode.min,
                "Consumer Key (optional)":currentNode.consumerKey,
                "Consumer Secret (optional)":currentNode.consumerSecret,
                "Token Key (optional)":currentNode.tokenKey,
                "Token Secret (optional)":currentNode.tokenSecret,
                "Search Terms  (name:value)":currentNode.searchTerm,
                "URI OR Name":currentNode.URI,
                "Update Frequency (milliseconds)":currentNode.updateFrequency},
                x:x,
                y:y,
                graph:{
                    nodes:filterNodes,
                    edges:filterEdges
                }};

        }
        else{

            resultNodes[resultNodes.length]= {id:temp, label:currentNode.description, type:currentNode.type,state:{
                content:currentNode.content,
                latitude:currentNode.latitude,
                longitude:currentNode.longitude,
                name:currentNode.name,
                Max: currentNode.max,
                Min: currentNode.min,
                "Consumer Key (optional)":currentNode.consumerKey,
                "Consumer Secret (optional)":currentNode.consumerSecret,
                "Token Key (optional)":currentNode.tokenKey,
                "Token Secret (optional)":currentNode.tokenSecret,
                "Search Terms  (name:value)":currentNode.searchTerm,
                "URI OR Name":currentNode.URI,
                "Update Frequency (milliseconds)":currentNode.updateFrequency},
                x:x,
                y:y
                }
        };





        nodecounter++;  // new id for next node
        x = x+width+70;
    }


    console.log("Nodes created:", resultNodes);

    callbackWithNodesDone(resultNodes);
}




/*
 function createFilters(filterArray)
 {
     for(var i=0; i< filterArray.length; i++)
     {
         var begin= {id:0, label:"in", type:"dataflow-input", x:180, y:120, 'input-type':"all"};
         var end =  {id:1, label:"out", type:"dataflow-output", x:947, y:120, 'output-type':"all"};

         filterNodes= new Array(begin,end);

         nodes[nodecounter] = {id:nodecounter, label:filterArray[i].label,x:280, y:250, type:"Filter", graph:{nodes:filterNodes,edges:[]}};
         nodecounter++;
     }
 }
*/
