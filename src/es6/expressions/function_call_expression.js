/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_call_expression.js
* Created at  : 2019-08-26
* Updated at  : 2020-09-06
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

debugger
const { is_expression }        = require("../../es5/helpers");
const { CALL_EXPRESSION }      = require("../enums/precedence_enum");
const { arguments_definition } = require("../nodes");
const {
    is_delimiter_token,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
    id         : "Function call expression",
	type       : "Expression",
	precedence : CALL_EXPRESSION,

    is : (token, parser) => {
        if (is_expression(parser) && is_delimiter_token(token, '(')) {
            return get_last_non_comment_node(parser) !== null;
        }
    },
	initialize : (node, token, parser) => {
        const callee     = get_last_non_comment_node(parser);
        const prev_state = parser.current_state;

        const args = arguments_definition.generate_new_node(parser);

        node.callee    = callee;
        node.arguments = args;
        node.start     = callee.start;
        node.end       = args.end;

        parser.ending_index  = node.end.index;
        parser.current_state = prev_state;
    },
};
