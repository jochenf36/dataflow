( function (Dataflow) {

    // Dependencies
    var BaseResizable = Dataflow.prototype.node("base-resizable");
    var CurrentLight= Dataflow.prototype.node("Current Light");

    CurrentLight.description = 'Self updating light component, retrieves the current flux value of the device';

    CurrentLight.Model = BaseResizable.Model.extend({
        defaults: function () {
            var defaults = BaseResizable.Model.prototype.defaults.call(this);
            defaults.label = " ";
            defaults.type = "Current Light";
            defaults.w = 300;
            defaults.h = 70;
            defaults.icon = "lightbulb";
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


    CurrentLight.View = BaseResizable.View.extend({
        initialize: function (options) {
            BaseResizable.View.prototype.initialize.call(this, options);

        }
    });

}(Dataflow) );
