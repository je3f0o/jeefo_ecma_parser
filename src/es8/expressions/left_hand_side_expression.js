/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : left_hand_side_expression.js
* Created at  : 2019-09-03
* Updated at  : 2019-09-05
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

const { EXPRESSION }                = require("../enums/precedence_enum");
const { left_hand_side_expression } = require("../enums/states_enum");

/*
const destructuring_expressions_tree = [
    "New expression",
    "Member expression",
    "Primary expression",
];
*/
const destructuring_expressions = [
    "Array literal",
    "Object literal"
];

module.exports = {
    id         : "Left hand side expression",
    type       : "Expression",
    precedence : EXPRESSION,

    is (_, { current_state }) {
        return current_state === left_hand_side_expression;
    },

    _refine (expression, parser) {
        const node = new this.Node();

        switch (expression.id) {
            case "Super property"     :
            case "Member expression"  :
            case "Primary expression" :
                expression = parser.refine("new_expression", expression);
                break;
            case "New expression"  :
            case "Call expression" : break;
            default:
                parser.throw_unexpected_refine(node, expression);
        }

        node.expression = expression;
        node.start      = expression.start;
        node.end        = expression.end;

        return node;
    },

    is_destructuring (expression) {
        if (expression.id === "Primary expression") {
            return destructuring_expressions.includes(
                expression.expression.id
            );
        }
    },

    is_valid_simple_assignment_target (expression, parser) {
        return expression.is_valid_simple_assignment_target(parser);
    },
};
