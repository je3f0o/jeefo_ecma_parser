/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : assignment_element.js
* Created at  : 2019-09-05
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

const { EXPRESSION }         = require("../enums/precedence_enum");
const { assignment_element } = require("../enums/states_enum");

module.exports = {
    id         : "Assignment element",
	type       : "Expression",
	precedence : EXPRESSION,

    is     : (_, { current_state : s }) => s === assignment_element,
	refine : (node, expression, parser) => {
        let initializer = null, target;

        if (expression.id !== "Assignment expression") {
            parser.throw_unexpected_refine(node, expression);
        }

        if (expression.expression.id === "Assignment operator") {
            console.log("TODO:", node.id);
        } else {
            target = parser.refine(
                "destructuring_assignment_target",
                expression.expression
            );
        }

        node.target      = target;
        node.initializer = initializer;
        node.start       = target.start;
        node.end         = (initializer || target).end;
    },
};
