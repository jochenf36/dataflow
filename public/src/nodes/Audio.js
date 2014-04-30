( function (Dataflow) {

    // Dependencies
    var BaseResizable = Dataflow.prototype.node("base-resizable");
    var Audio = Dataflow.prototype.node("Audio");

    Audio.description = 'Simple Text-to-Speech component';

    Audio.Model = BaseResizable.Model.extend({
        defaults: function () {
            var defaults = BaseResizable.Model.prototype.defaults.call(this);
            defaults.label = " ";
            defaults.type = "Audio";
            defaults.w = 200;
            defaults.h = 100;
            defaults.icon = "microphone";
            defaults.nodeColor="lavender";
            return defaults;
        },
        inputinput: function (value) {
            this.view.$inner.text(value);

        },
        inputcontent: function (value) {
           // this.view.$inner.text(value);
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


    Audio.View = BaseResizable.View.extend({
        initialize: function (options) {
            BaseResizable.View.prototype.initialize.call(this, options);

        }
    });

}(Dataflow) );
