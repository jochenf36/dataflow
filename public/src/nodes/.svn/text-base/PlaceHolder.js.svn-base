( function (Dataflow) {

    // Dependencies
    var BaseResizable = Dataflow.prototype.node("base-resizable");
    var PlaceHolder = Dataflow.prototype.node("PlaceHolder");

    PlaceHolder.Model = BaseResizable.Model.extend({
        defaults: function () {
            var defaults = BaseResizable.Model.prototype.defaults.call(this);
            defaults.type = "PlaceHolder";
            defaults.w = 300;
            defaults.h = 400;
            defaults.nodeColor= "antiquewhite";
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


    PlaceHolder.View = BaseResizable.View.extend({
        initialize: function (options) {
            BaseResizable.View.prototype.initialize.call(this, options);

        }
    });

}(Dataflow) );
