(function (Dataflow) {
  var Search = Dataflow.prototype.plugin("search");

  var SearchResult = Backbone.Model.extend({
    defaults: {
      source: '',
      icon: '',
      action: null,
      label: '',
      description: ''
    }
  });

  var SearchResults = Backbone.Collection.extend({
    model: SearchResult,
    initialize: function (models, options) {
      if (!options) {
        options = {};
      }
      this.search = options.search;
    }
  });

  var ResultView = Backbone.View.extend({
    tagName: 'li',
    template: '<i class="icon-<%- icon %>"></i><span class="name"><%- label %></span><span class="description"><%- description %></span>',
    events: {
      'click': 'clicked'
    },
    render: function () {
      this.$el.html(_.template(this.template, this.model.toJSON()));
    },
    clicked: function () {
      if (!this.model.get('action')) {
        return;
      }
      this.model.get('action')();
    }
  });

  Search.initialize = function (dataflow) {
    var $search = $('<div class="dataflow-plugin-search">' +
        '<input type="search" placeholder="Search" results="5" x-webkit-speech />' +
        '<button id="actions"><i class="icon-plus"></i></button>' + '<span class="spacebetweenIcons"/>'+
        '<button id="save"><i class="fa fa-floppy-o"></i></button>' + '<span class="spacebetweenIcons"/>'+
        '<button id="view"><i class="fa fa-eye"></i></button>' +
        '</div>');
    var $input = $search.find('input');
    var $buttonAction = $search.find("#actions");
    var $buttonSave = $search.find("#save");
    var $buttonView = $search.find("#view");

      dataflow.$el.prepend($search);

    $input.on('keydown', function (event) {
      // Ctrl-s again to get out of the search field
      if ((event.ctrlKey || event.metaKey) && event.which === 83) {
        event.preventDefault();
        $input.val('');
        $input.blur();
        dataflow.removeCard('searchresults');
      }
    });

    $input.on('keyup search webkitspeechchange', function (event) {
      if (event.keyCode === 13 && Search.results && Search.results.length === 1) {
        var card = dataflow.shownCards.get('searchresults');
        if (!card) {
          return;
        }
        $('li', card.el).click();
        dataflow.removeCard('searchresults');
        $input.val('');
        return;
      }
      if (!$input.val()) {
        dataflow.removeCard('searchresults');
        return;
      }
      Search.search($input.val(), dataflow);
    });

      dataflow.showPlugin('menu'); // show menu on start

      $buttonAction.on('click', function () {
      dataflow.showPlugin('menu');
    });

    $buttonSave.on('click', function () {

        saveGraph(dataflow,$);

      //    need to be reloaded in order to create the filters
        setTimeout(function(){         location.reload();
        },200);

    });

    $buttonView.on('click', function () {

        // to do save and VIEW option for document
        saveGraph(dataflow,$)

        setTimeout(function(){        location.href = '/tourguideTemplate';
        },200);


    });

    Search.focus = function () {
      $input.val('');
      $input.focus();
    };
  };

  Search.addCommand = function (command) {
    Search.commands.push(command);
  };

  Search.handleCommands = function (text, dataflow) {
    var handled = false;
    _.each(Search.commands, function (command) {
      if (handled) {
        return;
      }
      _.each(command.names, function (name) {
        if (handled) {
          return;
        }
        if (text.indexOf(name) === 0) {
          // Prepare arguments
          var argumentString = text.substr(name.length).trim();
          var args = argumentString.split(' ');

          // Validate arguments
          if (args.length !== command.args.length) {
            return;
          }

          // We found the command
          handled = true;

          args.push(function (results) {
            if (results.length === 0) {
              return;
            }
            _.each(results, function (result) {
              result.action = function () {
                args.unshift(result.item);
                command.execute.apply(command, args);
              };
            });
            var Card = Dataflow.prototype.module('card');
            var resultList = new SearchResults(results, {
              search: argumentString
            });
            var ResultsView = new Backbone.CollectionView({
              tagName: 'ul',
              className: 'dataflow-plugin-search-results',
              collection: resultList,
              itemView: ResultView
            });
            var ResultsCard = new Card.Model({
              id: 'searchresults',
              dataflow: dataflow,
              card: ResultsView,
              pinned: false
            });
            dataflow.addCard(ResultsCard);
            Search.results = resultList;
          });

          command.preview.apply(command, args);
        }
      });
    });
    return handled;
  };

  Search.commands = [];

  Search.search = function (text, dataflow) {
    dataflow.removeCard('searchresults');

    // Check commands for match
    if (Search.handleCommands(text, dataflow)) {
      // Handled by the command, ignore
      return;
    }

    var Card = Dataflow.prototype.module('card');
    var results = new SearchResults([], {
      search: text
    });
    var ResultsView = new Backbone.CollectionView({
      tagName: 'ul',
      className: 'dataflow-plugin-search-results',
      collection: results
    });
    ResultsView.itemView = ResultView;
    var ResultsCard = new Card.Model({
      id: 'searchresults',
      dataflow: dataflow,
      card: ResultsView,
      pinned: false
    });
    results.on('add', function () {
      dataflow.addCard(ResultsCard);
    });

    Search.results = results;

    _.each(dataflow.plugins, function (plugin, name) {
      if (!plugin.onSearch) {
        return;
      }
      Search.searchPlugin(results, text, plugin);
    });
  };

  Search.searchPlugin = function (results, text, plugin) {
    plugin.onSearch(text, function (pluginResults) {
      if (text !== Search.results.search) {
        // Search has changed, ignore results
        return;
      }

      pluginResults.forEach(function (result) {
        results.add(result);
      });
    });
  };

}(Dataflow));
