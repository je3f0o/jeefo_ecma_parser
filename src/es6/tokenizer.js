/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : tokenizer.js
* Created at  : 2017-05-23
* Updated at  : 2019-08-28
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

module.exports = function register_token_definitions (tokenizer) {
    // TemplateLiteral
    tokenizer.register({
        id       : "Backtick",
        priority : 1,

        is         : character => character === '`',
        initialize : (token, current_character, streamer) => {
            token.value = '`';
            token.start = streamer.clone_cursor_position();
            token.end   = streamer.clone_cursor_position();
        },
    });

    // Arrow function punctuator
    tokenizer.register({
        id       : "Arrow",
        priority : 21,

        is : (character, streamer) => {
            return character === '=' && streamer.is_next_character('>');
        },
        initialize : (token, current_character, streamer) => {
            const start = streamer.clone_cursor_position();
            streamer.cursor.move(1);

            token.value = "=>";
            token.start = start;
            token.end   = streamer.clone_cursor_position();
        },
    });

    // Rest element's prefix
    tokenizer.register({
        id       : "Rest",
        priority : 21,

        is : (character, streamer) => {
            if (character === '.' && streamer.is_next_character('.')) {
                const index = streamer.cursor.position.index;
                return streamer.at(index + 1) === '.';
            }
        },
        initialize : (token, current_character, streamer) => {
            const start = streamer.clone_cursor_position();
            streamer.cursor.move(2);

            token.value = "...";
            token.start = start;
            token.end   = streamer.clone_cursor_position();
        },
    });
};
