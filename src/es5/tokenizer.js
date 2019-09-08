/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : tokenizer.js
* Created at  : 2017-04-08
* Updated at  : 2019-09-08
* Author      : jeefo
* Purpose     :
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { JeefoTokenizer } = require("@jeefo/parser");
const delimiters         = require("./token_definitions/delimiters");

const es5_tokenizer = new JeefoTokenizer();

es5_tokenizer.
// Identifier
register({
    id       : "Identifier",
    priority : 0,

    is         : () => true,
    initialize : (token, _, streamer) => {
        const start = streamer.clone_cursor_position();
        let length = 1;

        while (true) {
            let character = streamer.at(start.index + length);
            if (character === null ||
                character <= ' '   ||
                delimiters.includes(character)) { break; }

            length += 1;
        }

        streamer.cursor.move(length - 1);

        token.value = streamer.substring_from_offset(start.index);
        token.start = start;
        token.end   = streamer.clone_cursor_position();
    },
}).

// Slash
register({
    id       : "Slash",
    priority : 19,

	is         : current_character => current_character === '/',
    initialize : (token, current_character, streamer) => {
        token.value = current_character;
        token.start = streamer.clone_cursor_position();
        token.end   = streamer.clone_cursor_position();
    },
});

es5_tokenizer.register(require("./token_definitions/delimiter_definition"));
es5_tokenizer.register(require("./token_definitions/comment"));
es5_tokenizer.register(require("./token_definitions/string"));
es5_tokenizer.register(require("./token_definitions/number"));
es5_tokenizer.register(require("./token_definitions/operator_definition"));

module.exports = es5_tokenizer;
