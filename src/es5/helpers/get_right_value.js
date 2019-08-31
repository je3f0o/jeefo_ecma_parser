/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : get_right_value.js
* Created at  : 2019-02-04
* Updated at  : 2019-08-28
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

const { get_last_non_comment_node } = require("../../helpers");

function get_right_value (parser, left_precedence) {
    let right_value = parser.parse_next_node(left_precedence);

    if (right_value === null) {
        if (parser.next_token === null) {
            parser.throw_unexpected_end_of_stream();
        } else {
            parser.throw_unexpected_token();
        }
    } else if (right_value.id === "Comment") {
        parser.post_comment = right_value;
        return get_last_non_comment_node(parser, true);
    }

    return right_value;
}

module.exports = get_right_value;
