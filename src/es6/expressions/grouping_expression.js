/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : grouping_expression.js
* Created at  : 2019-08-18
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

const {GROUPING_EXPRESSION} = require("../enums/precedence_enum");
const {
    expression,
    grouping_expression,
} = require("../enums/states_enum");

const cover_id = "Cover parenthesized expression and arrow parameter list";

const CAPTURE_FIRST_LETTER = / ([a-z])/g;
const cover_id_camel = cover_id.replace(CAPTURE_FIRST_LETTER, (_, $1) => {
    return $1.toUpperCase();
});

module.exports = {
	id         : "Grouping expression",
    type       : "Primary expression",
	precedence : GROUPING_EXPRESSION,

	is         : (_, {current_state: s}) => s === grouping_expression,
    initialize : (node, token, parser) => {
        const {prev_node} = parser;
        parser.expect(cover_id_camel, prev_node.id === cover_id);
        let {
            expression        : expr,
            open_parenthesis  : open,
            close_parenthesis : close,
        } = prev_node;

        const list       = [];
        const delimiters = [];
        while (expr) {
            if (expr.id === "Expression") {
                list.unshift(expr.right);
                delimiters.push(expr.delimiter);
                expr = expr.left;
            } else {
                list.unshift(expr);
                expr = null;
            }
        }

        node.open_parenthesis  = open;
        node.expressions_list  = list;
        node.delimiters        = delimiters;
        node.close_parenthesis = close;
        node.start             = open.start;
        node.end               = close.end;

        parser.current_state     = expression;
        parser.prepare_next_node = true;
    }
};
