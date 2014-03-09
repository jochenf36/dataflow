var nodecounter=0; // keeps track of all the nodes, also used to assign id to a node

var edgecounter=0; // keeps track of all the nodes, also used to assign id to a node

//  eliminate underscore and capitalize first letter
function makePretty(string)
{
    var res = string.replace(/_/g, ' ');

    return res.charAt(0).toUpperCase() + res.slice(1);
}

// PlaceHolder prototype
    function PlaceHolder(label, id)
    {
        this.id= id;
        this.label = label;
    }



 // TextComponent prototype
 function TextComponent(label, content, input)
 {
     this.label = label;
     this.content = content;
     this.input = input;
 }

 // Filter prototype
 function Filter(label, nodes, edges)
 {
     this.label = label;
     this.nodes = nodes;
     this.edges = edges;
 }

// get all the placeholders for the document and send them back as an array
function getRemotePlaceholders(anom,callback)
{
    anom.get(
        "../../getPlaceholders",
        function(data) {

            var placeholderArray = new Array();

            for(var i=0; i<data.length; i++){
               var placeholder =  data[i];

                placeholderArray.push(new PlaceHolder(makePretty(placeholder.description),placeholder.name));
            }
            callback(placeholderArray);
        }
    );
}

// the full document graph from the server
 function getDocumentGraph(anom, resultNodes, resultEdges, callback)
{
    anom.get(
        "../../getDocumentGraph",
        function(data) {

          console.log("Full document graph: ", data);
      ;

            createGraph(data, resultNodes,resultEdges,callback);

        }
    );
}


function createGraph(graph, resultNodes,resultEdges, callback)
{
    var nodes =  graph.nodes;

    var edges =  graph.edges;

    createNodes(nodes, resultNodes, function(nodes){
        createEdges(edges,nodes, resultEdges,function()
        {
            callback();
        });
    });


}


function createEdges(edges,nodes, resultEdges,callback)
{
    for(i in edges)
    {
        var edge = edges[i];


        var outputNodeName = edge.output;
        var inputNodeName = edge.input;

        for(j in nodes){
            var targetnode = nodes[j];


            if(outputNodeName===targetnode.state.name)
            {

                for(y in nodes){
                    var sourceNode = nodes[y];

                    if(inputNodeName===sourceNode.state.name)
                    {
                        console.log("Edge: ", sourceNode.id, " AND " , targetnode.id);

                        resultEdges[edgecounter]= {source:{node:sourceNode.id, port:"output"}, target:{node:targetnode.id, port:"input"}, route:0};
                        edgecounter++;
                    }
                }


            }
        }

    }

    console.log("Edges created:", resultEdges);

    callback();
}

function createNodes(nodes, resultNodes,callbackWithNodesDone)
{

    var maxItemsOnRow=4;
    var x = 200;
    var y = 90;
    var width = 200;
    var height = 100;

    var maxItemsOnRow=4;

    for(i in nodes)
    {
        var currentNode = nodes[i];

        currentNode.type  = currentNode.class.substring(currentNode.class.indexOf(".rsl")+5);

        // determine max amount of items on one row
        var res=i%maxItemsOnRow;
        if(res==0&& i!=0){
            x = 200;
            y = y +  height + 50;
        }
        resultNodes[nodecounter]= {id:nodecounter, label:currentNode.description, type:currentNode.type,state:{content:currentNode.content,name:currentNode.name}, x:x, y:y,w:width, h:height};

        nodecounter++;  // new id for next node
        x = x+width+70;


    }
    console.log("Nodes created:", resultNodes);

    callbackWithNodesDone(resultNodes);
}



 // create nodes for textcomponents
 function createTextComponentsNodes(textComponentsArray)
 {
     var x = 170;
     var y = 200+ 90 + 130;
     var width = 200;
     var height = 100;

     var j = nodes.length;
     var up = true;
     for(var i=0; i<textComponentsArray.length; i++)
     {


         nodes[nodecounter]= {id:nodecounter, label:textComponentsArray[i].label, type:"TextComponent",state:{content:textComponentsArray[i].content, input:JSON.stringify(textComponentsArray[i].input)}, x:x, y:y,w:width, h:height};
         nodecounter++;

         x = x+width+60;

         j++;

         if(up===true)
         {
             y = y + 100;
             up=false;
         }
         else
         {
             y = y - 100;
             up=true;
         }


     }
 }


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




 function setupEdges(edges)
 {
     edges[0]= {source:{node:4, port:"output"}, target:{node:8, port:"0"}, route:0};
     edges[1]= {source:{node:8, port:"1"}, target:{node:0, port:"input"}, route:1};

     edges[2]= {source:{node:5, port:"output"}, target:{node:8, port:"0"}, route:0};

 }