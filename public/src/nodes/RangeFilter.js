( function (Dataflow) {

    // Dependencies
    var BaseResizable = Dataflow.prototype.node("base-resizable");
    var RangeFilter = Dataflow.prototype.node("Range Filter");

    Placeholder.description = 'A specific filter that performs a filter operation by using a max and min value';

    RangeFilter.Model = BaseResizable.Model.extend({
        defaults: function () {
            var defaults = BaseResizable.Model.prototype.defaults.call(this);
            defaults.label = " ";
            defaults.type = "Range Filter";
            defaults.w = 200;
            defaults.h = 100;
            defaults.icon = "filter";
            defaults.nodeColor= "#D1FFE3";

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
                id: "Min",
                type: "int"
            },
            {
                id: "Max",
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


    RangeFilter.View = BaseResizable.View.extend({
        initialize: function (options) {
            BaseResizable.View.prototype.initialize.call(this, options);

        }
    });

}(Dataflow) );
