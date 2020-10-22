/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : destructuring_assignment_target.js
* Created at  : 2019-09-05
* Updated at  : 2020-08-24
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

const {EXPRESSION}                      = require("../enums/precedence_enum");
const {destructuring_assignment_target} = require("../enums/states_enum");

const lvalue = require("../semantics/left_hand_side_expression");

const destructuring_expressions_tree = [
    "New expression",
    "Member expression"
];

module.exports = {
    id         : "Destructuring assignment target",
	type       : "Destructuring expression",
	precedence : EXPRESSION,

    is : (_, {current_state: s}) => s === destructuring_assignment_target,

	refine (node, expression, parser) {
        debugger
        console.log(expression);
        console.log("HELLO ????");
        process.exit();
        if (! lvalue.is_valid_simple_assignment_target(expression, parser)) {
            parser.throw_unexpected_token(
                "Invalid destructuring assignment target",
                expression
            );
        }

        node.expression = expression;
        node.start      = expression.start;
        node.end        = expression.end;
    },

    _refine (target, parser) {
        const node = new this.Node();
        parser.change_state("left_hand_side_expression");
        const def = parser.next_node_definition;

        if (target.id !== "Assignment pattern") {
            let expression = target.expression;
            for (let id of destructuring_expressions_tree) {
                if (expression.id === id) {
                    expression = expression.expression;
                }
            }

            if (def.is_destructuring(expression)) {
                target = parser.refine("assignment_pattern", expression);
            } else if (target.id !== "Left hand side expression") {
                parser.throw_unexpected_token(null, target);
            }
        }

        node.expression = target;
        node.start      = target.start;
        node.end        = target.end;

        return node;
    }
};
