/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : assignment_property.js
* Created at  : 2019-09-03
* Updated at  : 2020-08-28
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

const {EXPRESSION}          = require("../enums/precedence_enum");
const {assignment_property} = require("../enums/states_enum");

module.exports = {
    id         : "Assignment property",
	type       : "Expression",
	precedence : EXPRESSION,
    is         : (_, {current_state: s}) => s === assignment_property,

	refine (node, expression, parser) {
        if (expression.id !== "Property definition") {
            parser.throw_unexpected_refine(node, expression);
        }
        let {expression: expr} = expression;

        switch (expr.id) {
            case "Identifier reference" : break;
            case "Cover initialized name" :
                expr = parser.refine("assignment_property_identifier", expr);
                break;
            case "Property assignment":
                expr = parser.refine("assignment_property_element", expr);
                break;
            default:
                debugger
                parser.throw_unexpected_refine(node, expr);
        }

        node.expression = expr;
        node.start      = expr.start;
        node.end        = expr.end;
    },
};
