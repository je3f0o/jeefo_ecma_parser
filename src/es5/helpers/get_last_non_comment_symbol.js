/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : get_last_non_comment_symbol.js
* Created at  : 2019-02-10
* Updated at  : 2019-02-10
* Author      : jeefo
* Purpose     :
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

module.exports = function get_last_non_comment_symbol (parser) {
    let i = parser.previous_symbols.length;
    while (i--) {
        if (parser.previous_symbols[i].id === "Comment") {
            continue;
        }
        return parser.previous_symbols[i];
    }

    throw new Error("Only comments");
};
