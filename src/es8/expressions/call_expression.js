/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : call_expression.js
* Created at  : 2019-08-27
* Updated at  : 2019-09-02
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

const { is_expression } = require("../../es5/helpers");
const { FUNCTION_CALL } = require("../enums/precedence_enum");
const {
    is_delimiter_token,
    get_last_non_comment_node,
} = require("../../helpers");

/*
const is_async_arrow_function = (callee, parser) => {
    if (callee.id !== "Identifier" || callee.value !== "async") { return; }

    const next_token = parser.look_ahead();
    if (next_token && next_token.start.line === callee.end.line) {
        return next_token.id === "Arrow";
    }
};
*/

module.exports = {
    id         : "Call expression",
	type       : "Expression",
	precedence : FUNCTION_CALL,

    is (token, parser) {
        if (is_expression(parser) && is_delimiter_token(token, '(')) {
            return get_last_non_comment_node(parser) !== null;
        }
    },
	initialize (node, token, parser) {
        const callee     = get_last_non_comment_node(parser);
        const prev_state = parser.current_state;

        parser.change_state("arguments_state");
        const args = parser.generate_next_node();

        node.callee    = callee;
        node.arguments = args;
        node.start     = callee.start;
        node.end       = args.end;

        parser.ending_index  = node.end.index;
        parser.current_state = prev_state;
    },
};
