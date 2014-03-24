( function (Dataflow) {

    // Dependencies
    var BaseResizable = Dataflow.prototype.node("base-resizable");
    var Placeholder = Dataflow.prototype.node("Placeholder");

    Placeholder.Model = BaseResizable.Model.extend({
        defaults: function () {
            var defaults = BaseResizable.Model.prototype.defaults.call(this);
            defaults.type = "PlaceHolder";
            defaults.w = 200;
            defaults.h = 100;
            defaults.nodeColor= "beige";
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
                id: "input",
                type: "all"
            }
        ],
        outputs: [

        ]
    });


    Placeholder.View = BaseResizable.View.extend({
        initialize: function (options) {
            BaseResizable.View.prototype.initialize.call(this, options);

        }
    });

}(Dataflow) );
