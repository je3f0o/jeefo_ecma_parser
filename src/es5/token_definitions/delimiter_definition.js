/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : delimiter_definition.js
* Created at  : 2019-03-08
* Updated at  : 2019-06-28
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
    id       : "Delimiter",
    priority : 10,

    is : current_character => {
        switch (current_character) {
            case ':' : case ';' :
            case ',' : case '?' :
            case '(' : case ')' :
            case '[' : case ']' :
            case '{' : case '}' :
                return true;
        }
        return false;
    },
    initialize : (token, current_character, streamer) => {
        token.value = current_character;
        token.start = streamer.clone_cursor_position();
        token.end   = streamer.clone_cursor_position();
    },
};
