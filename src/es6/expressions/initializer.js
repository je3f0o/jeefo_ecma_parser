/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : initializer.js
* Created at  : 2019-09-01
* Updated at  : 2020-09-06
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

const {EXPRESSION}        = require("../enums/precedence_enum");
const {initializer}       = require("../enums/states_enum");
const {is_operator_token} = require("../../helpers");

const init = (node, operator, expr) => {
    node.assign_operator = operator;
    node.expression      = expr;
    node.start           = operator.start;
    node.end             = expr.end;
};

const assert = (condition, node) => {
    if (! condition) throw node;
};

module.exports = {
    id         : "Initializer",
    type       : "Expression",
    precedence : EXPRESSION,
    is         : (_, {current_state: s}) => s === initializer,

    initialize (node, token, parser) {
        parser.expect('=', is_operator_token(token, '='));
        parser.change_state("punctuator");
        const operator = parser.generate_next_node();

        parser.prepare_next_state("assignment_expression", true);
        init(node, operator, parser.generate_next_node());
    },

    refine (node, expr, parser) {
        let operator, expression;
        try {
            assert(expr.id === "Assignment operator", expr);
            assert(expr.operator.value === '=', expr.operator);
            ({operator, right: expression} = expr);
        } catch (error_node) {
            parser.throw_unexpected_refine(node, error_node);
        }

        init(node, operator, expression);
    },
};
