/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : assignment_rest_element.js
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

const { EXPRESSION }              = require("../enums/precedence_enum");
const { assignment_rest_element } = require("../enums/states_enum");

module.exports = {
    id         : "Assignment rest element",
	type       : "Expression",
	precedence : EXPRESSION,

    is     : (_, { current_state : s }) => s === assignment_rest_element,
	refine : (node, expression, parser) => {
        if (expression.id !== "Spread element") {
            parser.throw_unexpected_refine(node, expression);
        }

        const target = parser.refine(
            "destructuring_assignment_target",
            expression.expression.expression
        );

        node.ellipsis = expression.ellipsis;
        node.target   = target;
        node.start    = node.ellipsis.start;
        node.end      = target.end;
    },
};
