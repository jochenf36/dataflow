( function (Dataflow) {

    // Dependencies
    var BaseResizable = Dataflow.prototype.node("base-resizable");
    var TextComp = Dataflow.prototype.node("TextComp");

    TextComp.description = 'A simple text component to present static text';

    TextComp.Model = BaseResizable.Model.extend({
        defaults: function () {
            var defaults = BaseResizable.Model.prototype.defaults.call(this);
            defaults.label = " ";
            defaults.type = "TextComp";
            defaults.w = 200;
            defaults.h = 100;
            defaults.icon = "pencil";
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
