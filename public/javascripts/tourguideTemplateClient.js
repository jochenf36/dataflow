var map;
var marker;

window.onbeforeunload = function() {
    socket.socket.disconnect() // close the socket connection when leaving the template
};

var currentLightValue;
function updateLightValue(lightvalue)
{
    console.log("updateLightValue", lightvalue);
    if(lightvalue!==undefined)
        currentLightValue= lightvalue;
}

function getcurrentLightValue()
{
    if(currentLightValue!==undefined)
        return currentLightValue;
    else
    return 20; // default for browser wihtout support
}

function initialize() {
    var initLocation= new google.maps.LatLng(-34.397, 150.644);
    var mapOptions = {
        center: initLocation,
        zoom: 12
    };
     map = new google.maps.Map(document.getElementById("googleMap"),
        mapOptions);

    marker = new google.maps.Marker({
        position: initLocation,
        map: map,
        title: 'You are here!'
    });
}




try
{

    var socket = io.connect('http://192.168.0.121:3001/notify');


    socket.on("connect", function() {
        console.log("connected");
        // Let the server know who is connected...
        socket.emit("user", { Id: 101 });
        console.log("send userid:", 101);


        // start sending current location of the client to the server every 60000 miliseconds = 1 minute
        var tid = setTimeout(myLocation, 5000);
        function myLocation() {
            // do some stuff...
            getLocation(function(position){

                console.log("Send update Location", location);
                socket.emit('Receive Location', {Id: 101 , lat:position.coords.latitude,long:position.coords.longitude});

            });
            tid = setTimeout(myLocation, 5000); // repeat myself
        };

        // start sending current flux value of the client to the server every 1000 miliseconds
        var tid2 = setTimeout(myLight, 5000);
        function myLight() {
            // do some stuff...
                console.log("Send update Light", getcurrentLightValue());
                socket.emit('Receive Light', {Id: 101 ,fluxValue: getcurrentLightValue()});

            tid2 = setTimeout(myLight, 5000); // repeat myself
        };



    });

    socket.on('update', function (rawData) {

        console.log("update:", rawData);


        var idName = rawData.id;
        var data = rawData.data


            if(idName.indexOf("Placeholder0")!=-1)
            {
                actionPlaceholder0(data);
            }
            else if(idName.indexOf("Placeholder1")!=-1)
            {
                actionPlaceholder1(data);
            }
            else if(idName.indexOf("Placeholder2")!=-1)
            {
                actionPlaceholder2(data);
            }
            else if(idName.indexOf("Placeholder3")!=-1)
            {
                actionPlaceholder3(data);
            }
            else if(idName.indexOf("Placeholder4")!=-1)
            {
                actionPlaceholder4(data);
            }
            else if(idName.indexOf("Placeholder5")!=-1)
            {
                actionPlaceholder5(data);
            }
            else if(idName.indexOf("Placeholder6")!=-1)
            {
                actionPlaceholder6(data);
            }


    });



} catch (e) { console.log(e); }





function errorHandler(err) {
    if(err.code == 1) {
        alert("Error: Access is denied!");
    }else if( err.code == 2) {
        //alert("Error: Position is unavailable!");
        console.log("Error position", err);
    }
}

function getLocation(sendLocation){

    if(navigator.geolocation){
        // timeout at 60000 milliseconds (60 seconds)
        var options = {timeout:60000};
        navigator.geolocation.getCurrentPosition(sendLocation,
            errorHandler,
            options);
    }else{
        alert("Sorry, browser does not support geolocation!");
    }
}



function actionPlaceholder0(data) {
    console.log("received update for Placeholder0:", data);


    if(data.content!==undefined)
    {
        $("#Placeholder0Title").remove();
        $("#Placeholder0").html("<h5>"+data.content+"</h5>");

    }

}


// convert to a small data title
function convertToShortDate(value)
{

    var weekday=new Array(7);
    weekday[0]="Sunday";
    weekday[1]="Monday";
    weekday[2]="Tuesday";
    weekday[3]="Wednesday";
    weekday[4]="Thursday";
    weekday[5]="Friday";
    weekday[6]="Saturday";

    value = weekday[value];

    if(value=="Sunday")
    {
        return "S";
    }
    else if(value=="Monday")
    {
        return "M";
    } else if(value=="Tuesday")
    {
        return "T";
    } else if(value=="Wednesday")
    {
        return "W";
    } else if(value=="Thursday")
    {
        return "TH";
    } else if(value=="Friday")
    {
        return "F";
    }
    else if(value=="Saturday")
    {
        return "S";
    }
}

// make the temperature value more user friendly
function getPrettyTemperature(max, min)
{
    var res = (max+min)/2 ;

    return res.toFixed(0);
}

// get the right icon from our pretty images
function getGoodIcon(value)
{

    console.log("Weer icon:", value);
    if(value=="clear-day")
    {
        return "wi-day-sunny-overcast";
    }
    else if(value=="clear-night")
    {
        return "wi-night-clear"
    }
    else if(value=="rain")
    {
        return "wi-rain";

    }
    else if(value=="snow")
    {
        return   "wi-snow"
    }
    else if(value=="sleet")
    {
        return "wi-day-cloudy"
    }
    else if(value=="wind")
    {
        return "wi-day-rain-wind"
    }
    else if(value=="fog")
    {
        return 	"wi-fog";
    }
    else if(value=="cloudy")
    {
        return "wi-day-cloud"
    }
    else if(value=="partly-cloudy-day")
    {
            return "wi-cloudy"
    }
    else if(value=="partly-cloudy-night")
    {
            return "wi-day-cloudy ";
    }
    else {
        // show default
        return "wi-day-sunny-overcast ";
    }


    return res.toFixed(0);
}

function actionPlaceholder1(data) {
    console.log("received update for Placeholder1:", data);


    var dailyForcast = data.daily.data;

    var start = new Date(),

        day2 = new Date(),
        day3 = new Date(),
        day4 = new Date(),
        day5 = new Date(),
        day6 = new Date(),
        day7 = new Date();



    day2.setDate(start.getDate() + 1);
    day3.setDate(start.getDate() + 2);
    day4.setDate(start.getDate() + 3);
    day5.setDate(start.getDate() + 4);
    day6.setDate(start.getDate() + 5);
    day7.setDate(start.getDate() + 6);


    start = convertToShortDate(start.getDay());
    day2 = convertToShortDate(day2.getDay());
    day3 = convertToShortDate(day3.getDay());
    day4 = convertToShortDate(day4.getDay());
    day5 = convertToShortDate(day5.getDay());
    day6 = convertToShortDate(day6.getDay());
    day7 = convertToShortDate(day7.getDay());

    var icon0 =dailyForcast[0].icon;
    var icon1 =dailyForcast[1].icon;
    var icon2 =dailyForcast[2].icon;
    var icon3 =dailyForcast[3].icon;
    var icon4 =dailyForcast[4].icon;
    var icon5 =dailyForcast[5].icon;
    var icon6 =dailyForcast[6].icon;



    var valueHTML = ("<table class='table table-striped'>" +

        "<tbody>" +
        "<tr>" +
          "<td>"+start+"</td>" +
          "<td>"+day2+"</td>"+
          "<td>"+day3+"</td>"+
          "<td>"+day4+"</td>"+
        "<td>"+day5+"</td>"+
        "<td>"+day6+"</td>"+
        "<td>"+day7+"</td>"+
        "</tr>"+

        "<tr>" +
            "<td class='"+ getGoodIcon(icon0)  +" fa-1x'>"+ getPrettyTemperature(dailyForcast[0].temperatureMax ,dailyForcast[0].temperatureMin) +"°</td>"+
            "<td class='"+ getGoodIcon(icon1)  +" fa-1x'>"+ getPrettyTemperature(dailyForcast[1].temperatureMax ,dailyForcast[1].temperatureMin) +"°</td>"+
            "<td class='"+ getGoodIcon(icon2)  +" fa-1x'>"+ getPrettyTemperature(dailyForcast[2].temperatureMax ,dailyForcast[2].temperatureMin) +"°</td>"+
            "<td class='"+ getGoodIcon(icon3)  +" fa-1x'>"+ getPrettyTemperature(dailyForcast[3].temperatureMax ,dailyForcast[3].temperatureMin) +"°</td>"+
            "<td class='"+ getGoodIcon(icon4)  +" fa-1x'>"+ getPrettyTemperature(dailyForcast[4].temperatureMax ,dailyForcast[4].temperatureMin) +"°</td>"+
            "<td class='"+ getGoodIcon(icon5)  +" fa-1x'>"+ getPrettyTemperature(dailyForcast[5].temperatureMax ,dailyForcast[5].temperatureMin) +"°</td>"+
            "<td class='"+ getGoodIcon(icon6)  +" fa-1x'>"+ getPrettyTemperature(dailyForcast[6].temperatureMax ,dailyForcast[6].temperatureMin) +"°</td>"+

        "</tr>"+
        "</tbody></table>");


    $("#Placeholder1").removeClass("label label-default");
    $("#Placeholder1").html(valueHTML);




}

function actionPlaceholder2(data) {
    console.log("received update for Placeholder2:", data);
    $("#Placeholder2").removeClass("label label-default");

    $("#Placeholder2").html("<h6>"+data.currently.temperature+" </h6>");



}

function actionPlaceholder3(data) {
    console.log("received update for Placeholder3:", data.content, "value:");


    if(data.content!==undefined)
    {
        console.log("content:", data.content)
        if(data.content.indexOf("AUDIO")<0)
        {
            console.log("data inzetten",data.content)
            $("#Placeholder3Title").remove();
            $("#Placeholder3").val(data.content);
        }
        else{
            console.log("test");

            $("#Placeholder3Title").remove();
            var contentAudio = data.content.substring( data.content.indexOf(":")+1);
            $("#Placeholder3").html(contentAudio);
           speak(contentAudio);
        }

    }

}

var isAlreadySpeaking=false;

function speak(content)
{

    console.log("isalready", isAlreadySpeaking);
    if(isAlreadySpeaking==false)
    {
        isAlreadySpeaking=true;
        console.log("SPeak");


        var msg = new SpeechSynthesisUtterance(content);


        msg.onend = function(e) {
            console.log("end text"),
            setTimeout(function(){  isAlreadySpeaking=false; },30000);

        };


        window.speechSynthesis.speak(msg);
    }

}

function actionPlaceholder4(data) {
    console.log("received update for Placeholder4:", data);

    $("#Placeholder4Title").remove();

    var businesses = data.businesses;

    var listContent = "";

    var amount = 6;
    if(businesses.length<amount)
        amount = businesses.length;

    for(var i=0; i<amount ; i++)
    {
        var business = businesses[i];

        var rating =""

        if(business.rating<2)
        {
            rating= "<span class='badge red'>"+ business.rating+ " <i class='glyphicon glyphicon-heart-empty'></i> "    +   "</span>"
        }
        else if(business.rating>=2 && business.rating<=3.5)
        {
            rating= "<span class='badge yellow'>"+ business.rating+ " <i class='glyphicon glyphicon-heart-empty'></i> "    +   "</span>"
        }
        else{
            rating= "<span class='badge green '>"+ business.rating +" <i class='glyphicon glyphicon-heart'></i> "    +   "</span>"

        }

        if(business.phone!==undefined && business.phone!=""){
            listContent+= "<a class='list-group-item' href='tel:+6494452687'>" +
                rating+
                "<small>"+business.name + ":  <em>" + business.display_phone +"</em></small></a>";
        }
        else{
            listContent+= "<a class='list-group-item'>" +
                rating+
                "<small>"+business.name+"</small></a>";
        }


    }

    $("#POIList").html(listContent);



}

function actionPlaceholder5(data) {
    console.log("received update for Placeholder5:", data);

    $("#Placeholder5Title").remove();

    var contentArray = data.content;

    listContent="";
    for(i in contentArray)
    {
        var element = contentArray[i];
        listContent+=
            "<small>"+element+"</small>";

    }


    $("#Events").html(listContent);




}

function actionPlaceholder6(data) { // google maps placeholder

    console.log("received update for Placeholder6:", data);
    $("#Placeholder6Title").remove();

    var currentLocation = new google.maps.LatLng(data.lat, data.long);

    map.setCenter(currentLocation);
    marker.setPosition(currentLocation);

};
