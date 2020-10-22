/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : assignment_expression.js
* Created at  : 2019-09-02
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

const {get_last_non_comment_node} = require("../../helpers");
const {
    EXPRESSION,
    ASSIGNMENT_EXPRESSION,
} = require("../enums/precedence_enum");
const {
    expression,
    assignment_expression,
} = require("../enums/states_enum");

module.exports = {
    id         : "Assignment expression",
	type       : "Assignment expression",
	precedence : EXPRESSION,

    is         : (_, {current_state: s}) => s === assignment_expression,
	initialize : (node, token, parser) => {
        parser.change_state("expression");
        parser.parse_next_node(ASSIGNMENT_EXPRESSION - 1);
        const expr = get_last_non_comment_node(parser, true);

        node.expression = expr;
        node.start      = expr.start;
        node.end        = expr.end;

        parser.end(node);
        parser.current_state = expression;
    },

    refine (node, expr, parser) {
        switch (expr.id) {
            case "Expression" :
                expr = expr.expression;
                break;
            case "For header" :
                switch (parser.next_token.id) {
                    case "Operator" :
                        parser.set_prev_node(expr.left);
                        parser.change_state("expression");
                        expr = parser.parse_next_node(ASSIGNMENT_EXPRESSION-1);
                        break;
                    default:
                        debugger
                        parser.throw_unexpected_refine(node, expr);
                }
                break;
            default:
                debugger
                parser.throw_unexpected_refine(node, expr);
        }

        node.expression = expr;
        node.start      = expr.start;
        node.end        = expr.end;
    }
};
