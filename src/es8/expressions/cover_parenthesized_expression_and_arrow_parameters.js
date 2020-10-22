/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : cover_parenthesized_expression_and_arrow_parameters.js
* Created at  : 2019-09-02
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

const {expression}                = require("../enums/states_enum");
const {get_last_non_comment_node} = require("../../helpers");
const {
    EXPRESSION,
    TERMINATION,
} = require("../enums/precedence_enum");
const {
    is_rest,
    is_comma,
    is_arrow_token,
    is_open_parenthesis,
    is_close_parenthesis,
    validate_object_literals,
} = require("../../helpers");

module.exports = {
    id         : "Cover parenthesized expression and arrow parameter list",
	type       : "ES6+ cover expression",
	precedence : EXPRESSION,

    is: (token, parser) => (
        parser.current_state === expression &&
        is_open_parenthesis(parser) &&
        get_last_non_comment_node(parser) === null
    ),

	initialize (node, token, parser) {
        parser.change_state("punctuator");
        const open = parser.generate_next_node();

        let expr            = null;
        let last_expr       = null;
        let has_arrow       = false;
        let rest_expression = null;

        parser.context_stack.push(node.id);
        parser.prepare_next_state("assignment_expression", true);
        while (! is_close_parenthesis(parser)) {
            if (is_rest(parser)) {
                parser.change_state("function_rest_parameter");
                rest_expression = parser.generate_next_node();
                parser.prepare_next_state("punctuator", true);
                break;
            }

            parser.parse_next_node(TERMINATION);
            expr = get_last_non_comment_node(parser, true);
            if (expr === last_expr) throw new Error("Infinite loop detected.");

            if (parser.is_terminated) {
                const {next_token: {id, value} = {}} = parser;
                if (! id) parser.throw_unexpected_end_of_stream();
                parser.expect("Delimiter", id === "Delimiter");
                switch (value) {
                    case '}' :
                        parser.is_terminated = false;
                        parser.prepare_next_node_definition(true);
                        if (parser.is_terminated && is_comma(parser)) {
                            // Faking ParenthesizedExression because of
                            // FunctionRestParameter
                            // That is why it is called
                            // CoverParenthesizedExpressionAnd...
                            parser.is_terminated = false;
                            parser.end(parser.next_token);
                            parser.change_state("expression");
                        }
                        break;
                    case ')' : break;
                    default: parser.throw_unexpected_token();
                }
            }

            last_expr = expr;
        }
        parser.expect(')', is_close_parenthesis);
        parser.is_terminated = false;
        parser.change_state("punctuator");
        const close = parser.generate_next_node();
        parser.context_stack.pop();

        node.open_parenthesis  = open;
        node.expression        = expr;
        node.rest_expression   = rest_expression;
        node.close_parenthesis = close;
        node.start             = open.start;
        node.end               = close.end;

        parser.end(node);
        parser.is_terminated = false;

        // () ...
        // (p) ...
        if (! rest_expression) {
            const next_token = parser.look_ahead();
            // () => ...
            // (p) => ...
            if (next_token && is_arrow_token(next_token)) has_arrow = true;
            // () ...
            else if (! expr) parser.throw_unexpected_token();
        }

        if (rest_expression || has_arrow) {
            parser.current_state = expression;
        } else {
            validate_object_literals(expr, parser);
            parser.change_state("grouping_expression");
            parser.prepare_next_node = false;
        }
    },
};
