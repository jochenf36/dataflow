( function (Dataflow) {

    // Dependencies
    var BaseResizable = Dataflow.prototype.node("base-resizable");
    var CurrentDeviceLocation = Dataflow.prototype.node("Current Location");

    CurrentDeviceLocation.description = 'Self updating location component, provides the current location of the device';

    CurrentDeviceLocation.Model = BaseResizable.Model.extend({
        defaults: function () {
            var defaults = BaseResizable.Model.prototype.defaults.call(this);
            defaults.label = " ";
            defaults.type = "Current Location";
            defaults.w = 300;
            defaults.h = 70;
            defaults.icon = "location-arrow";
            return defaults;
        },
        inputinput: function (value) {
            this.view.$inner.text(value);

        },
        inputcontent: function (value) {
            this.view.$inner.text(value);
        }
        ,
        inputs: [
            {
                id: "Update Frequency (milliseconds)",
                type: "int"
            }

        ],
        outputs: [
            {
                id: "output",
                type: "all"
            }
        ]
    });


    CurrentDeviceLocation.View = BaseResizable.View.extend({
        initialize: function (options) {
            BaseResizable.View.prototype.initialize.call(this, options);

        }
    });

}(Dataflow) );
