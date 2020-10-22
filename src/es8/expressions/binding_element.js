/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binding_element.js
* Created at  : 2019-09-02
* Updated at  : 2020-09-09
* Author      : jeefo
* Purpose     :
* Description : I discarded SingleNameBinding. Maybe i will add later or not...
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const {EXPRESSION}      = require("../enums/precedence_enum");
const {is_identifier}   = require("../../helpers");
const {binding_element} = require("../enums/states_enum");

const refine_from_assignment_operator = (expression, parser) => {
    parser.expect('=', () => expression.operator.value === '=');
    switch (expression.left.id) {
        case "Identifier reference" :
            return parser.refine("single_name_binding", expression);
        case "Assignment pattern" :
            return parser.refine("binding_element_pattern", expression);
    }
    debugger
    throw expression;
};

const refine_from_assignment_element = (expr, parser) => {
    switch (expr.target.id) {
        case "Identifier reference" :
            return parser.refine("single_name_binding", expr);
        case "Array literal" :
            return parser.refine("binding_element_pattern", expr.target);
        case "Assignment pattern" :
            return parser.refine("binding_element_pattern", expr);
    }
    console.log(expr);
    debugger
};

const refine_from_assignment_expression = ({expression: expr}, parser) => {
    switch (expr.id) {
        case "Assignment operator" :
            return refine_from_assignment_operator(expr, parser);
        case "Identifier reference" :
            return parser.refine("single_name_binding", expr);
        case "Array literal"  :
        case "Object literal" :
            return parser.refine("binding_element_pattern", expr);
    }
    console.log(expr);
    debugger
};

module.exports = {
    id         : "Binding element",
	type       : "Expression",
	precedence : EXPRESSION,

    is         : (_, {current_state: s}) => s === binding_element,
	initialize : (node, token, parser) => {
        if (is_identifier(parser)) {
            parser.change_state("single_name_binding");
        } else {
            parser.change_state("binding_element_pattern");
        }
        const expr = parser.generate_next_node();

        node.expression = expr;
        node.start      = expr.start;
        node.end        = expr.end;
    },

    refine (node, expr, parser) {
        switch (expr.id) {
            case "Assignment element" :
                expr = refine_from_assignment_element(expr, parser);
                break;
            case "Assignment expression" :
                expr = refine_from_assignment_expression(expr, parser);
                break;
            default:
                console.log(expr);
                debugger
                parser.throw_unexpected_refine(node, expr);
        }

        node.expression = expr;
        node.start      = expr.start;
        node.end        = expr.end;
    }
};
