var Marionette = require('backbone.marionette');

module.exports = Marionette.ItemView.extend({
    template: require('../../templates/mobile-footer.hbs'),

    events: {
        'click .open-dictionary': 'openDictionary'
    },

    openDictionary: function() {
        App.core.vent.trigger('dictionary:show');
    }
});
