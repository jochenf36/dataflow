var tourtemplate = require('.././routes/tourguideTemplate');


/**
 * Created by jochen on 19/03/14.
 */
exports.setupServer = function setupServer()
{

    try
    {
        var sio = require('socket.io');
        var io = sio.listen(3001).set('log level', 2);
        var pres = io.of("/notify").on('connection', function (socket) {

            // Clients need to send a "user" message to identify themselves...
            socket.on("user", function(userData)
            {
                try
                {
                    // Make sure we have the data we need...
                    if (userData == null || (userData.Id || null) == null) {
                        return;
                    }

                    // Join the user to their own private channel so we can send them notifications...
                    socket.join(userData.Id);
                } catch (e) { console.log(e); }
            });

            // update server when you know the new location of the client
            socket.on("Receive Location", function(location)
            {
                var filteredData = {lat: location.lat, long:location.long};
                tourtemplate.SetClientLocation(filteredData)
            });

            // update server when you know the new light value of the client
            socket.on("Receive Light", function(light)
            {
                var filteredData = {fluxValue: light.fluxValue};
                tourtemplate.SetClientLight(filteredData)
            });


            // We can now "push" information to the user from any process that can connect to this service...
            socket.on("push", function(data)
            {
                try
                {
                    console.log("push data:",data);
                    // Make sure we have the data we need...
                    if (data == null || (data.Id || null) == null) {
                        return;
                    }
                  //  console.log(data);

                    // Let's clean up the data a little (we don't need to tell the user who they are)
                    var channel = data.Id;
                    delete data.Id;

                    // Now we will braodcast the data only to the user's private channel...
                    socket.broadcast.to(channel, data).emit("update", data)
                } catch (e) { console.log(e); }
            });
        });
    } catch (e)
    {
        console.log(e);
    }
}


