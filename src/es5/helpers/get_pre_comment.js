/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : get_pre_comment.js
* Created at  : 2019-02-15
* Updated at  : 2019-02-15
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

module.exports = function get_pre_comment (parser) {
    if (parser.current_symbol !== null && parser.current_symbol.id !== "Comment") {
        parser.throw_unexpected_token();
    }

    return parser.current_symbol;
};
