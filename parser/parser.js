var Natural = require('natural');
var sanitizeHtml = require('sanitize-html');


Natural.PorterStemmer.attach();

module.exports = {
    _dicts: {},

    _preprocessDicts: function(dicts) {
        dicts.forEach(function(dict) {
            if(this._dicts[dict.name]) return;

            this._dicts[dict.name] = dict.words.map(function(word) {
                if (word.original) return word.original.stem();
                return word.stem();
            });

        }, this);
    },

    _preprocessDict: function(dict) {
        return dict.map(function(word) {
            if (word.original) return word.original.stem();
            return word.stem();
        });
    },

    _tokenize: function(text) {
        return this._tokenizer.tokenize(sanitizeHtml(text), { allowedTags: [] });
    },

    highlight: function(text, truncatedWords, isDescription) {
        var paragraphs = text.split(/(<br>|<\/br>)/g);
        return paragraphs.map(function(paragraph, index) {
            var isLast = index+1 === paragraphs.length;
            var additionalText = isDescription && isLast ?
                '&hellip;&nbsp;<a class="episode-more">More</a>' :
                '';
            return '<p>' + paragraph.split(/\s/g).map(function(token) {
                if(token === '<br>' || token === '</br>') {
                    return '';
                }
                var words = token.match(/\w+('|.|,)?(\w+)?/g) || [];

                return words.map(function(word, index) {
                    var lastWasBr = false;
                    if (word == 'br' || word == 'br>') {
                        if(index === 0 || lastWasBr) {
                            return '';
                        } else {
                            return '</br>';
                        }
                        lastWasBr = true;
                    }

                    lastWasBr = false;

                    if (truncatedWords.indexOf(word.stem()) != -1) {
                        return '<span title="Перевод" class="word highlight">' + word + '</span>';
                    } else {
                        return '<span title="Перевод" class="word">' + word + '</span>';
                    }
                }).join(' ')
            }).join(' ') + additionalText + '</p>';
        }).join('');
    },

    _tokenizer: new Natural.WordTokenizer(),

    parse: function(dicts, episode) {
        this._preprocessDicts(dicts);

        if(!episode.body) {
            return;
        }

        var dict = dicts[0];

        if(episode.originalArticleLink === 'forbes.com') {
            episode.body = episode.body.replace(/\[(.*?)\]/g, function() { return '' });
        }

        var processedDescription;
        var processedBody;
        var truncatedWords = this._dicts[dict.name];
        var description = episode.body.split(' ').slice(0, 30).join(' ');

        processedDescription = this.highlight(description, truncatedWords, true);
        processedBody = episode.body && this.highlight(episode.body, truncatedWords);

        return {
            processedDescription: processedDescription,
            processedBody: processedBody
        };

    }

};
