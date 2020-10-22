/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_call_expression.js
* Created at  : 2019-09-06
* Updated at  : 2020-09-08
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

const {CALL_EXPRESSION} = require("../enums/precedence_enum");
const {
    expression,
    async_arrow_function: async_arrow_fn,
} = require("../enums/states_enum");
const {
    is_arrow_token,
    is_open_parenthesis,
    has_no_line_terminator,
    get_last_non_comment_node,
} = require("../../helpers");

const is_not_new_expression = stack => stack.length
    ? stack[stack.length - 1] !== "New operator without arguments"
    : true;

module.exports = {
    id         : "Function call expression",
	type       : "Call expression",
	precedence : CALL_EXPRESSION,

    is: (token, parser) => (
        parser.current_state === expression &&
        is_open_parenthesis(parser) &&
        is_not_new_expression(parser.context_stack) &&
        get_last_non_comment_node(parser) !== null
    ),

	initialize (node, token, parser) {
        const callee = get_last_non_comment_node(parser);

        parser.change_state("arguments_state");
        const args = parser.generate_next_node();

        node.callee    = callee;
        node.arguments = args;
        node.start     = callee.start;
        node.end       = args.end;

        const next_token = parser.look_ahead();
        const is_async_arrow_fn = (
            callee.id === "Identifier reference" &&
            callee.identifier.identifier_name.value === "async" &&
            next_token && is_arrow_token(next_token) &&
            has_no_line_terminator(args, next_token)
        );
        parser.current_state = is_async_arrow_fn ? async_arrow_fn : expression;
    },
};
