/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : grouping_expression.js
* Created at  : 2017-08-17
* Updated at  : 2019-09-08
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { GROUPING_EXPRESSION } = require("../enums/precedence_enum");
const { grouping_expression } = require("../enums/states_enum");

module.exports = {
	id         : "Grouping expression",
    type       : "Expression",
	precedence : GROUPING_EXPRESSION,

	is         : (_, { current_state : s }) => s === grouping_expression,
    initialize : (node, token, parser) => {
        const cover_parenthesized_expr = parser.prev_node;
        console.log(cover_parenthesized_expr);
        process.exit();

        node.open_parenthesis  = open;
        node.expressions_list  = expressions;
        node.delimiters        = delimiters;
        node.close_parenthesis = close;
        node.start             = open.start;
        node.end               = close.end;

        parser.ending_index  = node.end.index;
        parser.current_state = current_state;
    }
};
