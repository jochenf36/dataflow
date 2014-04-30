( function (Dataflow) {

    // Dependencies
    var BaseResizable = Dataflow.prototype.node("base-resizable");
    var WebService = Dataflow.prototype.node("Web Service");

    WebService.description = "A simple webservice component, that provide a webservice for RESTfull API's";


    WebService.Model = BaseResizable.Model.extend({
        defaults: function () {
            var defaults = BaseResizable.Model.prototype.defaults.call(this);
            defaults.label = " ";
            defaults.type = "Web Service";
            defaults.w = 230;
            defaults.h = 200;
            defaults.icon = "cloud";
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
                id: "URI OR Name",
                type: "all"

            },
            {
                id: "Search Terms  (name:value)",
                type: "object"
            },
            {
                id: "Update Frequency (milliseconds)",
                type: "int"
            },
            {
                id: "Token Key (optional)",
                type: "String"
            },
            {
                id: "Token Secret (optional)",
                type: "String"
            },
            {
                id: "Consumer Key (optional)",
                type: "String"
            },
            {
                id: "Consumer Secret (optional)",
                type: "String"
            }
        ],
        outputs: [
            {
                id: "output",
                type: "all"
            }
        ]
    });


    WebService.View = BaseResizable.View.extend({
        initialize: function (options) {
            BaseResizable.View.prototype.initialize.call(this, options);

        }
    });

}(Dataflow) );
