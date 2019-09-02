/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : cover_call_expression_and_async_arrow_head.js
* Created at  : 2019-09-02
* Updated at  : 2019-09-03
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

const { EXPRESSION }                = require("../enums/precedence_enum");
const { is_expression }             = require("../../es5/helpers");
const { async_arrow_function }      = require("../enums/states_enum");
const { get_last_non_comment_node } = require("../../helpers");

const is_async_head_call_expression = (node, token) => {
    return (
        node &&
        node.id           === "Call expression" &&
        node.callee.id    === "Identifier" &&
        node.callee.value === "async" &&
        token.id          === "Arrow"
    );
};

const error_message = "Malformed arrow function parameter list";
const valid_arrow_parameters = (call_expr, token, parser) => {
    if (call_expr.callee.end.line !== call_expr.arguments.start.line) {
        parser.throw_unexpected_token(error_message, call_expr.arguments);
    } else if (call_expr.arguments.end.line !== token.start.line) {
        parser.throw_unexpected_token(error_message);
    }
};

module.exports = {
    id         : "Cover call expression and async arrow head",
	type       : "Expression",
	precedence : EXPRESSION,

    is (token, parser) {
        if (is_expression(parser)) {
            const last_node = get_last_non_comment_node(parser);
            if (is_async_head_call_expression(last_node, token)) {
                valid_arrow_parameters(last_node, token, parser);
                return true;
            }
        }
    },
	initialize (node, token, parser) {
        const call_expr = get_last_non_comment_node(parser);
        const { prev_node, current_state } = parser;

        parser.next_token = call_expr.callee;
        parser.change_state("async_state");
        const keyword = parser.generate_next_node();

        parser.prev_node = call_expr.arguments;
        parser.change_state("arrow_formal_parameters");
        const parameters = parser.generate_next_node();

        node.keyword    = keyword;
        node.parameters = parameters;
        node.start      = keyword.start;
        node.end        = parameters.end;

        parser.prev_node     = prev_node;
        parser.prev_state    = current_state;
        parser.next_token    = token;
        parser.ending_index -= 1;
        parser.current_state = async_arrow_function;
    },
};
