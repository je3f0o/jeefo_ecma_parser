/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : conditional_operator.js
* Created at  : 2019-03-28
* Updated at  : 2020-09-09
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

const {expression}             = require("../enums/states_enum");
const {CONDITIONAL_EXPRESSION} = require("../enums/precedence_enum");
const {
    is_colon,
    is_operator_token,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
    id         : "Conditional operator",
    type       : "Conditional expression",
    precedence : CONDITIONAL_EXPRESSION,

    is: (token, parser) => (
        parser.current_state === expression &&
        is_operator_token(token, '?') &&
        get_last_non_comment_node(parser) !== null
    ),

    initialize (node, token, parser) {
        const condition = get_last_non_comment_node(parser, true);

        parser.expect('?', is_operator_token(token, '?'));
        parser.change_state("punctuator");
        const question_mark = parser.generate_next_node();

        parser.prepare_next_state("assignment_expression", true);
        const truthy_expr = parser.generate_next_node();

        parser.prepare_next_state("punctuator", true);
        parser.expect(':', is_colon);
        const colon = parser.generate_next_node();

        parser.prepare_next_state("assignment_expression", true);
        const falsy_expr = parser.generate_next_node();

        node.condition         = condition;
        node.question_mark     = question_mark;
        node.truthy_expression = truthy_expr;
        node.colon             = colon;
        node.falsy_expression  = falsy_expr;
        node.start             = condition.start;
        node.end               = falsy_expr.end;

        parser.end(node);
        parser.current_state = expression;
    }
};
