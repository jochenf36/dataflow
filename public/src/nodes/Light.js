( function (Dataflow) {

    // Dependencies
    var BaseResizable = Dataflow.prototype.node("base-resizable");
    var Light = Dataflow.prototype.node("Light");

    Light.description = 'Simple Light component';


    Light.Model = BaseResizable.Model.extend({
        defaults: function () {
            var defaults = BaseResizable.Model.prototype.defaults.call(this);
            defaults.label = " ";
            defaults.type = "Light";
            defaults.w = 200;
            defaults.h = 100;
            defaults.icon = "lightbulb";
            defaults.nodeColor= "gold";
            return defaults;
        },
        inputflux: function (value) {
            var flux = this.attributes.state.flux;
            if(flux===undefined)
                flux ="";
            this.view.$inner.text("flux: " +value );
        }
       ,
        inputs: [

            {
                id: "flux",
                type: "float"
            }
        ],
        outputs: [
            {
                id: "output",
                type: "all"
            }
        ]
    });


    Light.View = BaseResizable.View.extend({
        initialize: function (options) {
            BaseResizable.View.prototype.initialize.call(this, options);

        }
    });

}(Dataflow) );
