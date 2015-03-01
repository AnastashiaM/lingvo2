var Marionette = require('backbone.marionette'),
    ControlsView = require('./controls.js'),
    DictionaryView = require('./dictionary.js'),
    UserModel = require('../models/user');

module.exports = DifficultyView = Marionette.ItemView.extend({

    model: UserModel,

    template: require('../../templates/difficulty.hbs'),

    difficulties: [
        'General',
        'Business English',
        'For TOEFL',
        'For GMAT',
        'For GRE',
        'Irregular verbs'
    ],

    events: {
        'click .easier': 'easier',
        'click .harder': 'harder',
        'click .j-show-dictionary': 'showDictionary'
    },

    showDictionary: function() {
        if($('.dictionary').hasClass('hide')) {
            $('.j-show-dictionary').text('Hide dictionary');
            $('.dictionary').removeClass('hide').delay(1).queue(function() {
                $(this).addClass("showing").dequeue();
            });
        } else {
            $('.j-show-dictionary').text('Show dictionary');
            $('.dictionary').removeClass('showing').delay(150).queue(function() {
                $(this).addClass('hide').dequeue();
            });
        }

        $('.mobile-dictionary').toggleClass('hide');

    },

    initialize: function() {
        this.listenTo(this.model, 'change:difficulty', this.toggleDifficulty);
    },

    toggleDifficulty: function() {
        this.$el.find('.difficulty').text(this.model.get('difficulty'));
        this._updateDisabled();
    },

    onRender: function() {
        this.harderButton = this.$el.find('.harder');
        this.easierButton = this.$el.find('.easier');
        this._updateDisabled();
        this.controlsView = new ControlsView({ model: this.model, el: this.$el.find('.user-controls') });
        a = new ControlsView({ model: this.model, el: $('.mobile-user-controls') });
        b = new DictionaryView({ model: this.model, el: $('.mobile-dictionary-view')} );
        this.dictionaryView = new DictionaryView({ model: this.model, el: this.$el.find('.dictionary-view')} );
    },

    _updateDisabled: function() {
        this.harderButton.toggleClass('disabled', this.model.get('difficulty') == _.last(this.difficulties));
        this.easierButton.toggleClass('disabled', this.model.get('difficulty') == _.first(this.difficulties));
    },


    easier: function() {
        if (this.model.get('difficulty') == _.first(this.difficulties)) return;

        var difficulty = this.difficulties[this.difficulties.indexOf(this.model.get('difficulty')) - 1];

        this.xhr && this.xhr.readyState < 4 && this.xhr.abort();
        this.xhr = this.model.set('difficulty', difficulty).save();
    },

    harder: function() {
        if (this.model.get('difficulty') == _.last(this.difficulties)) return;

        var difficulty = this.difficulties[this.difficulties.indexOf(this.model.get('difficulty')) + 1];

        this.model.save({ difficulty: difficulty });
    }

});
