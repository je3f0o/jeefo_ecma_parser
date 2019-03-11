/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : get_start_position.js
* Created at  : 2019-02-02
* Updated at  : 2019-02-12
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

module.exports = (pre_comment, current_token) => {
    let start = null;

    while (pre_comment) {
        start       = pre_comment.start;
        pre_comment = pre_comment.previous_comment;
    }

    return start || current_token.start;
};
