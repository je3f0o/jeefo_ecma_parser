/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : call_expression.js
* Created at  : 2019-08-27
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

const { CALL_EXPRESSION }             = require("../enums/precedence_enum");
const { get_last_non_comment_node }   = require("../../helpers");
const { expression, call_expression } = require("../enums/states_enum");

module.exports = {
    id         : "Call expression",
	type       : "Expression",
	precedence : CALL_EXPRESSION,
    is         : (_, { current_state : s }) => s === call_expression,

	initialize (node, token, parser) {
        const call_expr = get_last_non_comment_node(parser);

        node.expression = call_expr;
        node.start      = call_expr.start;
        node.end        = call_expr.end;

        parser.ending_index  = node.end.index;
        parser.current_state = expression;
    },
};
