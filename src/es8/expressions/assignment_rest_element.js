/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : assignment_rest_element.js
* Created at  : 2019-09-05
* Updated at  : 2020-08-26
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

const {EXPRESSION}              = require("../enums/precedence_enum");
const {assignment_rest_element} = require("../enums/states_enum");

const is_valid = ({id}) => id === "Spread element";

module.exports = {
    id         : "Assignment rest element",
	type       : "Destructuring assignment",
	precedence : EXPRESSION,

    is     : (_, {current_state: s}) => s === assignment_rest_element,
	refine : (node, expr, parser) => {
        if (! is_valid(expr)) parser.throw_unexpected_refine(node, expr);

        const {expression: {expression}} = expr;
        switch (expression.id) {
            case "Array literal"        :
            case "Object literal"       :
            case "Identifier reference" :
                break;
            default:
                parser.throw_unexpected_refine(node, expression);
        }
        node.ellipsis = expr.ellipsis;
        node.target   = expression;
        node.start    = expr.start;
        node.end      = expr.end;
    },
};
