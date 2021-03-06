var Marionette = require('backbone.marionette');
var ItemView = require('./episode');

module.exports = Marionette.CollectionView.extend({
    initialize: function() {
        this.listenTo(App.data.user, 'change:source', this._onDifficultyChange);
    },

    increment: function() {
        if(!this.isSent) {
            yaCounter.reachGoal('episodes-scrolled');
            this.isSent = true;
        }
        this.collection.increment();
    },

    _onDifficultyChange: function() {
        var collection = this.collection;

        collection.reset();
        collection.page = '0';

        if(this.xhr && this.xhr.readyState < 4) {
            this.xhr.abort();
        }

        if(this._timeout) {
            clearTimeout(this._timeout);
        }

        this._timeout = setTimeout(this._fetchCollection.bind(this), 500);
    },

    _fetchCollection: function() {
        this.xhr = this.collection
            .fetch();
    },

    className: 'episodes-holder',

    childView: ItemView
});
