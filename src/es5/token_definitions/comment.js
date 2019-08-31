/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : comment.js
* Created at  : 2019-03-05
* Updated at  : 2019-08-05
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

module.exports = {
    id       : "Comment",
    priority : 40,

    is : (current_character, streamer) => {
        if (current_character === '/') {
            const next_char = streamer.get_next_character();
            return next_char === '*' || next_char === '/';
        }
    },

    initialize : (token, current_character, streamer) => {
        let comment, is_inline;
        const start = streamer.clone_cursor_position();

        if (streamer.next() === '*') {
            let character = streamer.next(true), end_index;
            const start_index  = streamer.cursor.position.index;

            while (character) {
                if (character === '*' && streamer.is_next_character('/')) {
                    end_index = streamer.cursor.position.index;
                    streamer.cursor.move_next();
                    break;
                }
                character = streamer.next(true);
            }

            comment   = streamer.string.substring(start_index, end_index);
            is_inline = false;
        } else {
            streamer.cursor.move_next();
            comment   = streamer.eat_until_eol();
            is_inline = true;
        }

        token.value     = '';
        token.comment   = comment.trim();
        token.is_inline = is_inline;
        token.start     = start;
        token.end       = streamer.clone_cursor_position();
    }
};
