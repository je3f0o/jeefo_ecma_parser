/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : tokenizer.js
* Created at  : 2017-04-08
* Updated at  : 2019-03-27
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const Tokenizer  = require("jeefo_tokenizer"),
	  delimiters = require("./token_definitions/delimiters");

const es5_tokenizer = new Tokenizer();

es5_tokenizer.
// Identifier {{{1
register({
    id       : "Identifier",
    priority : 0,

    is         : () => true,
    initialize : (token, current_character, streamer) => {
        const start = streamer.get_cursor();
        let length = 1;

        while (true) {
            let next_character = streamer.at(start.index + length);
            if (next_character === null || next_character <= ' ' || delimiters.includes(next_character)) {
                break;
            }

            length += 1;
        }

        streamer.move_cursor(length - 1);

        token.value = streamer.substring_from(start.index);
        token.start = start;
        token.end   = streamer.get_cursor();
    },
}).

// Slash {{{1
register({
    id       : "Slash",
    priority : 50,

	is : (current_character, streamer) => {
		if (current_character === '/') {
			switch (streamer.at(streamer.cursor.index + 1)) {
                case '*' :
                case '/' :
                    return false;
            }
			return true;
		}
        return false;
	},
    initialize : (token, current_character, streamer) => {
        token.value = '/';
        token.start = token.end = streamer.get_cursor();
    },
});
// }}}1

es5_tokenizer.register(require("./token_definitions/delimiter_definition"));
es5_tokenizer.register(require("./token_definitions/comment"));
es5_tokenizer.register(require("./token_definitions/string"));
es5_tokenizer.register(require("./token_definitions/number"));
es5_tokenizer.register(require("./token_definitions/operator_definition"));

module.exports = es5_tokenizer;
