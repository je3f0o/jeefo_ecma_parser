/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_call_expression.js
* Created at  : 2019-09-06
* Updated at  : 2019-09-06
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

const { CALL_EXPRESSION } = require("../enums/precedence_enum");
const {
    expression,
    call_expression,
    async_arrow_function,
} = require("../enums/states_enum");
const {
    is_delimiter_token,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
    id         : "Function call expression",
	type       : "Expression",
	precedence : CALL_EXPRESSION,

    is (token, parser) {
        if (parser.current_state !== expression) { return; }

        if (is_delimiter_token(token, '(')) {
            return get_last_non_comment_node(parser) !== null;
        }
    },

	initialize (node, token, parser) {
        const callee = get_last_non_comment_node(parser);

        parser.change_state("arguments_state");
        const args = parser.generate_next_node();

        const is_async_function = (
            callee.id               === "Primary expression" &&
            callee.expression.id    === "Identifier reference" &&
            callee.expression.value === "async"
        );

        if (is_async_function) {
            node.args    = args;
            node.keyword = parser.refine(
                "contextual_keyword", callee.expression
            );

            parser.current_state = async_arrow_function;
        } else {
            node.callee    = callee;
            node.arguments = args;
            node.start     = callee.start;
            node.end       = args.end;

            parser.current_state = call_expression;
        }
    },
};
