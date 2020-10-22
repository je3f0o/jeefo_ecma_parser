/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : parenthesized_expression.js
* Created at  : 2019-08-28
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

const {parenthesized_expression} = require("../enums/states_enum");
const {
    STRUCTURE,
    TERMINATION,
} = require("../enums/precedence_enum");
const {
    is_open_parenthesis,
    is_close_parenthesis,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
    id         : "Parenthesized expression",
    type       : "Terminal structure",
    precedence : STRUCTURE,
    is         : (_, {current_state: s}) => s === parenthesized_expression,
    initialize : (node, token, parser) => {
        parser.expect('(', is_open_parenthesis);
        parser.change_state("punctuator");
        const open = parser.generate_next_node();

        parser.prepare_next_state("expression", true);
        if (is_close_parenthesis(parser)) {
            parser.throw_unexpected_token("Missing expression");
        }

        parser.parse_next_node(TERMINATION);
        const expr = get_last_non_comment_node(parser, true);

        if (parser.is_terminated) {
            const {streamer} = parser.tokenizer;
            parser.expect('}', streamer.get_current_character());
            parser.prepare_next_state("punctuator");
        }
        parser.expect(')', is_close_parenthesis);
        parser.change_state("punctuator");
        const close = parser.generate_next_node();

        node.open_parenthesis  = open;
        node.expression        = expr;
        node.close_parenthesis = close;
        node.start             = open.start;
        node.end               = close.end;
    }
};
