/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : computed_member_access.js
* Created at  : 2019-09-06
* Updated at  : 2020-09-09
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

const array_remove = require("@jeefo/utils/array/remove");
const {
    TERMINATION,
    MEMBER_EXPRESSION,
} = require("../enums/precedence_enum");
const {
    expression,
    computed_member_access,
} = require("../enums/states_enum");
const {
    is_open_square_bracket,
    is_close_square_bracket,
    get_last_non_comment_node: get_last_node,
} = require("../../helpers");

module.exports = {
    id         : "Computed member access",
    type       : "Member expression",
    precedence : MEMBER_EXPRESSION,
    is         : (token, {current_state: s}) => s === computed_member_access,

    initialize (node, token, parser) {
        parser.expect('[', is_open_square_bracket);
        parser.change_state("punctuator");
        const open = parser.generate_next_node();

        const has_in = parser.suffixes.includes("in");
        if (! has_in) parser.suffixes.push("in");
        parser.prepare_next_state("expression", true);
        parser.parse_next_node(TERMINATION);
        const expr = get_last_node(parser, true);
        if (! has_in) array_remove(parser.suffixes, "in");

        parser.expect(']', is_close_square_bracket);
        parser.change_state("punctuator");
        const close = parser.generate_next_node();

        node.open_square_bracket  = open;
        node.expression           = expr;
        node.close_square_bracket = close;
        node.start                = open.start;
        node.end                  = close.end;
    }
};
