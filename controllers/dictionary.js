var Dictionary = require('../app/models').Dictionary;
var Translator = require('../translator/translator');

module.exports = {

    get: function(req, res) {
        var translator = new Translator();
        var language = translator.languages()[req.session.language || 'chinese']['shortcut'];

        Dictionary.findOne({ user: req.user._id })
            .populate('words')
            .then(function(dictionary) {
                return Promise.all(dictionary.words.map(function(word) {
                    return translator.translate('en', language, word.text);
                }));
            })
            .then(function(words) {
                res.json(words.map(function(word, i) {
                    word.id = i;
                    return word;
                }));
            });
    }
};
