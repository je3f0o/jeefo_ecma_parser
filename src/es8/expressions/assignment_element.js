/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : assignment_element.js
* Created at  : 2019-09-05
* Updated at  : 2020-08-25
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

const { EXPRESSION }         = require("../enums/precedence_enum");
const { assignment_element } = require("../enums/states_enum");

const {
    is_valid_lhs_expr,
    is_destructuring_target,
    is_valid_simple_assignment_target,
} = require("../semantics/left_hand_side_expression");

const assert = (condition, node) => {
    if (typeof condition === "function") condition = condition();
    if (! condition) throw node;
};

module.exports = {
    id         : "Assignment element",
	type       : "Expression",
	precedence : EXPRESSION,

    is     : (_, {current_state: s}) => s === assignment_element,
	refine : (node, assignment_expression, parser) => {
        let initializer = null, target;

        if (assignment_expression.id !== "Assignment expression") {
            parser.throw_unexpected_refine(node, assignment_expression);
        }

        const {expression}         = assignment_expression;
        const {id, left, operator} = expression;

        try {
            if (id === "Assignment operator") {
                assert(operator.value === '=', {
                    node    : operator,
                    message : "assign operator",
                });
                assert(() => {
                    if (is_destructuring_target(left)) return true;
                    return is_valid_simple_assignment_target(left);
                }, {
                    node    : left,
                    message : "LeftHandSideExpression",
                });
                target      = left;
                initializer = parser.refine("initializer", expression);
            } else {
                assert(is_valid_lhs_expr(expression), {
                    node    : expression,
                    message : "LeftHandSideExpression",
                });
                target = expression;
            }
        } catch (error) {
            console.log(assignment_expression);
            debugger
            parser.throw_unexpected_token(
                `Invalid ${error.message} in ${
                    node.constructor.name
                }: ${ error.node.id }`, error.node
            );
        }

        node.target      = target;
        node.initializer = initializer;
        node.start       = target.start;
        node.end         = (initializer || target).end;
    },
};
