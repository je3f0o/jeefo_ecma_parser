/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : unary_expression.js
* Created at  : 2020-08-22
* Updated at  : 2020-08-22
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

const { UNARY_EXPRESSION, COMMA } = require("../enums/precedence_enum");
const { unary_expression }        = require("../enums/states_enum");
const { get_last_non_comment_node } = require("../../helpers");

module.exports = {
    id         : "Unary expression",
	type       : "Expression",
	precedence : UNARY_EXPRESSION,

    is         : (_, { current_state : s }) => s === unary_expression,
	initialize : (node, token, parser) => {
        node.expression = expression;
        node.start      = expression.start;
        node.end        = expression.end;
    },

    refine (node, expression, parser) {
        switch (expression.id) {
            // ... unary expressions
            default:
                expression = parser.refine("update_expression", expression);
        }

        node.expression = expression;
        node.start      = expression.start;
        node.end        = expression.end;
    }
};
