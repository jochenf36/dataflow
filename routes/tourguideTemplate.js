
/*
 * GET Tourguide templat.
 */


app = require('../app');
var editor = require('../routes/editor');
var iServer = require('../iServer/iServerAPI');


var Repeat = require('repeat');  // for repeating jobs

var events = require('events'); //needed for pub & sub pattern
var Forecast = require('forecast'); // module for weather info

var geolib = require("geolib"); // A small library to provide some basic geo functions like distance calculation, conversion of decimal coordinates to sexagesimal and vice versa, etc.





var currentLocationClient={lat:50.77861,long:4.24278};


exports.SetClientLocation = function(value){
    console.log("update location:",  value);
    currentLocationClient = value;
}

var pageActive; // if page is deactivated (when its on onother page -> stop all current repeaters

exports.deactivatePage = function(){
    pageActive=false;
}


function setupIndividualPair(pair,socket)
{

    var start =pair.start;
    var end = pair.end;



    if(end.iServerInfo !==undefined)
    {



        var updateFrequency = end.iServerInfo.updateFrequency;

        if(updateFrequency=== undefined)
        {
            updateFrequency = end.updateFrequency;
        }


        Repeat(function(){

            console.log("Send:",start.id , "Next in:", updateFrequency);

            start.value.Id= 101;

            socket.emit("push", start.value)

        }).every(updateFrequency, 'ms').while(function(){return pageActive;}).start.in(1, 'sec');
    }

}


var onceIn=false;

function setupPushingPairs(pairs) // link the latest updater to the placeholder and notify the client's placeholders
{

    var io = require('socket.io/node_modules/socket.io-client');
    var socket = io.connect('http://localhost:8080/notify');



     socket.once("connect", function() {
            console.log("connected");

         onceIn=true

            var i=0;
            for(i in pairs)
            {
                setupIndividualPair(pairs[i],socket);
            }

        });

    if(onceIn)
    {
        for(i in pairs)
        {
            setupIndividualPair(pairs[i],socket);
        }
    }


}







app.get('/tourguideTemplate',function(req, res){
    var documentName = req.session.currentDocumentName;

    res.render('tourguideTemplate', { link: "/editor/:name="+documentName});


});


var globalReq;

app.get('/tourguideTemplate/:name',function(req, res){

    console.log("_________________________________________________________________")
    var name = req.param('name').substring(req.param('name').indexOf("=")+1);

    req.session.currentDocumentName=  name;

    var documentName = req.session.currentDocumentName;

    console.log("Current document name in Cookies: "+documentName);


    res.render('tourguideTemplate', { link: "/editor/:name="+documentName});

    globalReq= req;

    pageActive= true

    users = {};
    componentPool=new Array();
    pairs = new Array();

    filters = {};

    getDocumentGraph(documentName, req);


});

var users = {}; // keep track of users to send update info to a specific user



var componentPool;

function getDocumentGraph(documentName)
{

    // first get all the placeholders (everything starts from these nodes)
    editor.getPlaceholders(documentName, function(placeholderArray)
    {

            iServer.getTubes(function(tubes){

                var filteredTubes= new Array();

                var tubeJSON =  JSON.parse(tubes); // parse to json

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

                        filteredTubes.push(filteredTube);
                       // console.log("Tube: ", filteredTube);

                    }


                };


                for(i in placeholderArray)
                {
                    var placeholderName=placeholderArray[i].name;
                    link(placeholderName,"Placeholder", filteredTubes, function(value){  // create an array containing all the linked components for this placeholder

                        value = value.reverse();
                        if(value.length>1){
                            var item = {start:"", end:""};
                              pairs.push(item);
                            connectLogic(value,0,undefined,item); // setup the observers and listeners for each component

                        }

                    });
                }

                setTimeout(function() {
                    setupPushingPairs(pairs);
                }, 2000);
           });


    });
}


var pairs;
var filters;

// go through stream and create "living objects"
function connectLogic(value,start, subject, item)
{


    if(start<value.length)
        {
            var id = value[start].id;
            var type = value[start].type;

            var component;



            if(component===undefined)  // if it is not in the pool create an component object
            {
               iServer.getNode(id,type, function(nodeRAW){

                   var node = JSON.parse(nodeRAW);

                   node.type  = node.class.substring(node.class.indexOf(".rsl")+5);

                   var component = new Component(node.name, node);


                   if(node.updateFrequency!==undefined && node.updateFrequency!=0 || node.type=="Filter")
                   {
                       item.end = component;
                   }

                   if(item.start.id=="testMe_Placeholder1")
                   {
                       console.log("Componente: ",component);
                   }

                   if(start==0)
                   {
                       item.start= component;
                   }

                    componentPool.push(component); // add newly created component to the pool

                   if(subject!==undefined) // if it has a listener
                   {
                       component.addListener(subject);
                   }

                    connectLogic(value,start+1,component,item);

                });
            }
        }
}


function Component(id, iServerInfo)
{
    this.id=id;
    this.iServerInfo = iServerInfo;
    this.listeners= new Array;
    this.value = {};
    this.type  = iServerInfo.type;


    var that = this;

    this.addListener= function(c)
                        {
                            this.listeners.push(c);
                        }

    this.updateFunction = function(data)
    {
        console.log("Not supported for type: ", this.type);
    };

    if(this.type=="Placeholder"){
        this.updateFunction = function(data)
        {
           console.log(this.id + "received updata:", data);
            this.value = {"id":this.id, "data":data}; // update the data of this element;
        }

    }else if(this.type=="WebService"){


        this.performAction = function(data, callback)
        {
            var result
            var webserviceID =  this.iServerInfo.URI;


            var consumerKey = this.iServerInfo.consumerKey;

            var consumerSecret = this.iServerInfo.consumerSecret;

            var tokenKey = this.iServerInfo.tokenKey;

            var tokenSecret = this.iServerInfo.tokenSecret;

            var searchTerm = this.iServerInfo.searchTerm;


            if(webserviceID=="Dark Sky")
            {

                var clientKey = consumerKey;

                if(clientKey=== undefined || clientKey=="")
                    clientKey = "842aa58ae1999975003bc1ad2c7c169c";


                var forecast = new Forecast({
                    service: 'forecast.io',
                    key: clientKey,
                    units: 'celcius', // Only the first letter is parsed
                    cache: true,      // Cache API requests?
                    ttl: {           // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/
                        minutes: 27,
                        seconds: 45
                    }
                });

                forecast.get([data.lat,data.long], function(err, weather) {
                    if(err) console.dir(err);
                    else callback(weather);
                });
            }
            else if(webserviceID=="Yelp"||"YELP")
            {


                if(searchTerm!== undefined)
                {


                    var jsonSearchTerm = JSON.parse(searchTerm);
                    jsonSearchTerm.ll = data.lat +"," + data.long;



                    var yelp = require("yelp").createClient({
                        consumer_key: consumerKey,
                        consumer_secret: consumerSecret,
                        token: tokenKey,
                        token_secret: tokenSecret
                    });

                    yelp.search(jsonSearchTerm, function(error, data) {

                        console.log(error);
                        callback(data);
                    });

                }


            }

        }

        this.updateFunction = function(data)
        {
            console.log("WebService: "+this.id +" received :",data);

            var that = this;
            this.performAction(data, function(weather){

                for(i in that.listeners)
                {
                    that.listeners[i].updateFunction(weather);

                }
            })

        }

    }else if(this.type=="CurrentLocation"){
        this.updateFunction = function(data)
        {

            for(i in this.listeners)
            {
                this.listeners[i].updateFunction(data);
            }
        }


        Repeat(function(){

            console.log("Update current location", currentLocationClient);
            that.updateFunction(currentLocationClient);

        }).every(this.iServerInfo.updateFrequency, 'ms').during(function(){return pageActive;}).start.in(0, 'sec');
    }
    else if(this.type == "Filter"){

        var filterElements = this.iServerInfo.elements;

        this.storageData={}; // init internal data of the filter -> data which must be filtered

        this.filterElements = new Array(); // will hold the elements of the filter that we retrieved from the iServer


        // add all the filterelement of the filter to its component instance
        for(item in filterElements)
        {
            var rawName = filterElements[item];

            var cleanType = rawName.substring(1, rawName.indexOf(":"));
            var cleanName = rawName.substring(rawName.indexOf(":")+1, rawName.indexOf("]"));

            var that = this;
           iServer.getNode(cleanName,cleanType, function(jsonObject){
               if(jsonObject!==undefined)
               {
                   var element = JSON.parse(jsonObject);

                   that.filterElements.push(element);


                   if(element.updateFrequency!==undefined)
                   {
                       console.log("Set the update freq of the filter");
                        that.updateFrequency = element.updateFrequency;

                       Repeat(function(){

                           that.updateFunction();

                       }).every(that.updateFrequency, 'ms').during(function(){return pageActive;}).start.in(300, 'sec');
                   }

               }
           })

        }

        var that  = this; // necessary to update the frequency for updating the corresponding placeholder
        // get the update rate for the filter by going over its elements

        this.updateFunction = function(data)
        {
            console.log("Filter: recieved update");
            if(data!==undefined)
            {
                var name = data.name
                this.storageData[name] = data;
            }


            var filterOutput = {};
            for(i in this.filterElements)
            {
                var item = this.filterElements[i];

                var type  = item.class.substring(item.class.indexOf(".rsl")+5);

                if(type == "RangeFilter") // procedure for RangeFilter
                {
                    var min  = item.min;
                    var max  = item.max;

                    for(i2 in this.filterElements)
                    {
                        var item2 = this.filterElements[i2];

                        var type2  = item2.class.substring(item2.class.indexOf(".rsl")+5);
                        if(type2=="CurrentLocation") // procedure when there is a currenlocation in the filter
                        {

                            // checks if 51.525, 7.4575 is within a radius of 5km from 51.5175, 7.4678

                            console.log("storageData :", that.storageData);

                            for(j in this.storageData)
                            {
                                var item3 = this.storageData[j];
                                var long = item3.longitude;
                                var lat = item3.latitude;


                                if(isInCurrentLocation(lat,long,max))
                                {
                                    console.log("Should uoutpt");

                                    filterOutput.content= item3.content;

                                }

                            }

                        }
                    }

                }

            }

            for(i in this.listeners)
            {

                this.listeners[i].updateFunction(filterOutput);
            }




        }
    }
    else if(this.type == "TextComp"){


            this.updateFunction = function(data)
            {
                console.log("textComp: "+this.id +" recieved :",data);

                var textCompData = {};

                textCompData.name = this.iServerInfo.name
                textCompData.content = this.iServerInfo.content;

                if(data.latitude!==undefined && data.longitude!==undefined) // if there is a location component conncected to the text comp added it to it
                {
                    textCompData.latitude = data.latitude;
                    textCompData.longitude = data.longitude;
                }

                for(i in this.listeners)
                {
                    this.listeners[i].updateFunction(textCompData); // update all the listeners
                }
            }

     }
     else if(this.type == "Location"){

        this.updateFunction = function()
        {
            var locationData = {};

            locationData.latitude = this.iServerInfo.latitude;
            locationData.longitude = this.iServerInfo.longitude;


            for(i in this.listeners)
            {
                this.listeners[i].updateFunction(locationData);
            }
        }
        var that = this;

        setTimeout(function(){that.updateFunction();} , 500);


    }

}


// funciton to check wether a point is wihtin a circle with a certain radious
function isInCurrentLocation(latitude, longitude, radius)
{
    return geolib.isPointInCircle(
        {latitude: currentLocationClient.lat, longitude:currentLocationClient.long},
        {latitude: latitude, longitude: longitude},
        radius
    );
}



function link(nodeName,nodeType,tubes, callback)
{
    var connectedTubes = new Array();
    for(i in tubes)
    {

        if(tubes[i].output==nodeName)
        {
            connectedTubes.push(tubes[i]);
        }
    }

  //  console.log("Nodename: ", nodeName, "connectedTubes: ", connectedTubes)

    if(connectedTubes.length==0)
    {
        var streamArray = [{id:nodeName,type:nodeType}];
        callback(streamArray);
    }
    else{
        for(j in connectedTubes){
            link(connectedTubes[j].input,connectedTubes[j].typeInput,tubes, function(values)
            {
               var newvalue = {id:connectedTubes[j].output, type:connectedTubes[j].typeOutput};

                values.push(newvalue);
               callback(values);
            });
        }
    }

}


