/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : conditional_operator.js
* Created at  : 2019-03-28
* Updated at  : 2019-08-27
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-11.12
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { TERNARY } = require("../enums/precedence_enum");
const {
    terminal_definition : terminal
} = require("../../common");
const {
    is_expression,
    prepare_next_expression,
} = require("../helpers");
const {
    is_colon,
    is_operator_token,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
    id         : "Conditional operator",
    type       : "Ternary operator",
    precedence : TERNARY,

    is : (token, parser) => {
        if (is_expression(parser) && is_operator_token(token, '?')) {
            return get_last_non_comment_node(parser) !== null;
        }
    },
    initialize : (node, current_token, parser) => {
        const condition         = get_last_non_comment_node(parser);
        const question_operator = terminal.generate_new_node(parser);
        const { current_state } = parser;

        prepare_next_expression(parser, true);
        let expression = parser.parse_next_node(TERNARY);
        if (expression === null) {
            parser.throw_unexpected_token();
        }
        const truthy_expression = get_last_non_comment_node(parser);

        parser.expect(':', is_colon);
        const colon_operator = terminal.generate_new_node(parser);

        prepare_next_expression(parser, true);
        expression = parser.parse_next_node(TERNARY);
        if (expression === null) {
            parser.throw_unexpected_token();
        }
        const falsy_expression = get_last_non_comment_node(parser);

        node.condition         = condition;
        node.question_operator = question_operator;
        node.truthy_expression = truthy_expression;
        node.colon_operator    = colon_operator;
        node.falsy_expression  = falsy_expression;
        node.start             = condition.start;
        node.end               = falsy_expression.end;

        parser.ending_index  = node.end.index;
        parser.current_state = current_state;
    }
};
