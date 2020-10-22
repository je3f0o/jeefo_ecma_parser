/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : grouping_expression.js
* Created at  : 2017-08-17
* Updated at  : 2020-09-01
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
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
        console.log("DEAD");
        process.exit();
        const {prev_node} = parser;
        parser.expect(cover_id_camel, prev_node.id === cover_id);
        const {open, expr, close} = prev_node;

        node.open_parenthesis  = open;
        node.expressions_list  = expr;
        node.close_parenthesis = close;
        node.start             = open.start;
        node.end               = close.end;

        parser.end(node);
        parser.current_state = expression;
        console.log(node);debugger
    }
};
