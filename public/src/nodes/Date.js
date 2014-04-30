( function (Dataflow) {

    // Dependencies
    var BaseResizable = Dataflow.prototype.node("base-resizable");
    var Date = Dataflow.prototype.node("Date");

    Date.description = 'Simple Date/time component';

    Date.Model = BaseResizable.Model.extend({
        defaults: function () {
            var defaults = BaseResizable.Model.prototype.defaults.call(this);
            defaults.label = " ";
            defaults.type = "Date";
            defaults.w = 200;
            defaults.h = 100;
            defaults.icon = "calendar";
            defaults.nodeColor= "peachpuff";
            return defaults;
        },

        inputs: [

            {
                id: "Date",
                type: "String",
                value:"dd-mm-yy -- hh:mm:ss"
            }

        ],
        outputs: [
            {
                id: "output",
                type: "all"
            }
        ]
    });


    Date.View = BaseResizable.View.extend({
        initialize: function (options) {
            BaseResizable.View.prototype.initialize.call(this, options);

        }
    });

}(Dataflow) );
