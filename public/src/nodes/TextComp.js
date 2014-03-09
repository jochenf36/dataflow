( function (Dataflow) {

    // Dependencies
    var BaseResizable = Dataflow.prototype.node("base-resizable");
    var TextComp = Dataflow.prototype.node("TextComp");

    TextComp.Model = BaseResizable.Model.extend({
        defaults: function () {
            var defaults = BaseResizable.Model.prototype.defaults.call(this);
            defaults.type = "TextComp";
            defaults.w = 250;
            defaults.h = 100;
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

            },
            {
                id: "content",
                type: "object"
            }
        ],
        outputs: [
            {
                id: "output",
                type: "all"
            }
        ]
    });


    TextComp.View = BaseResizable.View.extend({
        initialize: function (options) {
            BaseResizable.View.prototype.initialize.call(this, options);

        }
    });

}(Dataflow) );
