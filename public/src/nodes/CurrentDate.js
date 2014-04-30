( function (Dataflow) {

    // Dependencies
    var BaseResizable = Dataflow.prototype.node("base-resizable");
    var CurrentDate = Dataflow.prototype.node("Current Date");

    CurrentDate.description = 'Self updating date component, always presents the current date and time of the system';

    CurrentDate.Model = BaseResizable.Model.extend({
        defaults: function () {
            var defaults = BaseResizable.Model.prototype.defaults.call(this);
            defaults.label = " ";
            defaults.type = "Current Date";
            defaults.w = 300;
            defaults.h = 70;
            defaults.icon = "calendar";
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


    CurrentDate.View = BaseResizable.View.extend({
        initialize: function (options) {
            BaseResizable.View.prototype.initialize.call(this, options);

        }
    });

}(Dataflow) );
