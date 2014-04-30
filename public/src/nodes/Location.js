( function (Dataflow) {

    // Dependencies
    var BaseResizable = Dataflow.prototype.node("base-resizable");
    var Location = Dataflow.prototype.node("Location");

    Location.description = 'Simple Location component with longitude and latitude';

    Location.Model = BaseResizable.Model.extend({
        defaults: function () {
            var defaults = BaseResizable.Model.prototype.defaults.call(this);
            defaults.label = " ";
            defaults.type = "Location";
            defaults.w = 200;
            defaults.h = 100;
            defaults.icon = "compass";
            defaults.nodeColor= "lightcyan";
            return defaults;
        },
        inputlatitude: function (value) {
            var longitude = this.attributes.state.longitude;
            if(longitude===undefined)
                longitude ="";
            this.view.$inner.text("Latitude: " +value + "  Longitude: "+longitude);
        },
        inputlongitude: function (value) {
            var latitude = this.attributes.state.latitude;
            if(latitude===undefined)
                latitude ="";
            this.view.$inner.text("Latitude: " +latitude + "  Longitude: "+value);
        }
       ,
        inputs: [

            {
                id: "latitude",
                type: "float"
            },
            {
                id: "longitude",
                type: "float"
            }
        ],
        outputs: [
            {
                id: "output",
                type: "all"
            }
        ]
    });


    Location.View = BaseResizable.View.extend({
        initialize: function (options) {
            BaseResizable.View.prototype.initialize.call(this, options);

        }
    });

}(Dataflow) );
