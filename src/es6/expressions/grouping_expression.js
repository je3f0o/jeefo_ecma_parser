/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : grouping_expression.js
* Created at  : 2019-08-18
* Updated at  : 2019-09-08
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

const { GROUPING_EXPRESSION } = require("../enums/precedence_enum");
const {
    grouping_expression,
    expression : expression_state,
} = require("../enums/states_enum");

module.exports = {
	id         : "Grouping expression",
    type       : "Expression",
	precedence : GROUPING_EXPRESSION,

	is         : (_, { current_state : s }) => s === grouping_expression,
    initialize : (node, token, parser) => {
        const { open_parenthesis, close_parenthesis } = parser.prev_node;

        const expr = parser.refine(
            "expression_expression", parser.prev_node
        );

        node.open_parenthesis  = open_parenthesis;
        node.expression        = expr;
        node.close_parenthesis = close_parenthesis;
        node.start             = open_parenthesis.start;
        node.end               = close_parenthesis.end;

        parser.end(node);
        parser.current_state = expression_state;
    }
};
