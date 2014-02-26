( function (Dataflow) {

    // Dependencies
    var BaseResizable = Dataflow.prototype.node("base-resizable");
    var TextComponent = Dataflow.prototype.node("TextComponent");

    TextComponent.Model = BaseResizable.Model.extend({
        defaults: function () {
            var defaults = BaseResizable.Model.prototype.defaults.call(this);
            defaults.type = "TextComponent";
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
                type: "string"
            }
        ],
        outputs: [
            {
                id: "output",
                type: "all"
            }
        ]
    });


    TextComponent.View = BaseResizable.View.extend({
        initialize: function (options) {
            BaseResizable.View.prototype.initialize.call(this, options);

        }
    });

}(Dataflow) );
