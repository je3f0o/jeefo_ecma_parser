/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : assignment_element.js
* Created at  : 2019-09-05
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

const { EXPRESSION }         = require("../enums/precedence_enum");
const { assignment_element } = require("../enums/states_enum");

module.exports = {
    id         : "Assignment element",
	type       : "Expression",
	precedence : EXPRESSION,

    is     : (_, { current_state : s }) => s === assignment_element,
	refine : (node, element, parser) => {
        let initializer = null, target;

        if (element.id !== "Assignment expression") {
            parser.throw_unexpected_refine(node, element);
        }

        if (element.expression.id === "Assignment operator") {
            if (element.expression.operator.value !== '=') {
                parser.throw_unexpected_token(
                    "Invalid destructuring assignment target",
                    element.expression
                );
            }

            parser.change_state("destructuring_assignment_target");
            target = parser.next_node_definition._refine(
                element.expression.left, parser
            );

            initializer = parser.refine("initializer", {
                operator   : element.expression.operator,
                expression : element.expression.right,
            });
        } else {
            target = parser.refine(
                "destructuring_assignment_target",
                element.expression
            );
        }

        node.target      = target;
        node.initializer = initializer;
        node.start       = target.start;
        node.end         = (initializer || target).end;
    },
};
