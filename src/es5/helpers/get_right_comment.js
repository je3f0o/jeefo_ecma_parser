/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : get_right_comment.js
* Created at  : 2019-01-29
* Updated at  : 2019-01-29
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

module.exports = function get_right_comment (parser) {
    let right_comment = null;

    if (parser.next_symbol_definition && parser.next_symbol_definition.id === "Comment") {
        right_comment = parser.get_next_symbol(31); // <-- TODO: replace this magic number

        while (right_comment.left_comment) {
            right_comment = right_comment.left_comment;
        }
    }

    return right_comment;
};
