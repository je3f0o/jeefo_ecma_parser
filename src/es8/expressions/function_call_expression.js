/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_call_expression.js
* Created at  : 2019-08-27
* Updated at  : 2019-08-27
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

const { is_expression }        = require("../../es5/helpers");
const { FUNCTION_CALL }        = require("../enums/precedence_enum");
const { arguments_definition } = require("../../es6/common");
const {
    is_delimiter_token,
    get_last_non_comment_node,
} = require("../../helpers");

const is_async_arrow_function = (callee, parser) => {
    if (callee.id !== "Identifier" || callee.value !== "async") { return; }

    const next_token = parser.look_ahead();
    if (next_token && next_token.start.line === callee.end.line) {
        return next_token.id === "Arrow";
    }
};

module.exports = {
    id         : "Function call expression",
	type       : "Expression",
	precedence : FUNCTION_CALL,

    is : (token, parser) => {
        if (is_expression(parser) && is_delimiter_token(token, '(')) {
            return get_last_non_comment_node(parser) !== null;
        }
    },
	initialize : (node, token, parser) => {
        const callee            = get_last_non_comment_node(parser);
        const { current_state } = parser;

        const args = arguments_definition.generate_new_node(parser);

        node.callee    = callee;
        node.arguments = args;
        node.start     = callee.start;
        node.end       = args.end;

        if (is_async_arrow_function(callee, parser)) {
            parser.change_state("async_arrow_function");
        } else {
            parser.next_token    = token;
            parser.current_state = current_state;
        }
    },
};
