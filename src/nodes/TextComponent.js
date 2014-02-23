( function (Dataflow) {

    // Dependencies
    var BaseResizable = Dataflow.prototype.node("base-resizable");
    var TextComponent = Dataflow.prototype.node("TextComponent");

    TextComponent.Model = BaseResizable.Model.extend({
        defaults: function () {
            var defaults = BaseResizable.Model.prototype.defaults.call(this);
            defaults.type = "TextComponent";
            defaults.w = 200;
            defaults.h = 400;
            return defaults;
        },
        inputinput: function (value) {
            this.view.$inner.text(value);
        },
        inputstring: function (value) {
            this.send("output", value + " test");
        },
        inputint: function (value) {
            this.send("output", value);
        },
        inputfloat: function (value) {
            this.send("output", value);
        },
        inputboolean: function (value) {
            this.send("output", !value);
        },
        inputs: [
            {
                id: "input",
                type: "all"
            },
            {
                id: "Content",
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

    Test.View = BaseResizable.View.extend({
        initialize: function (options) {
            BaseResizable.View.prototype.initialize.call(this, options);
            this.$inner.text("view.$inner");
        }
    });

}(Dataflow) );
