/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : initializer.js
* Created at  : 2019-09-01
* Updated at  : 2019-09-09
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

const { EXPRESSION }  = require("../enums/precedence_enum");
const { initializer } = require("../enums/states_enum");

const init = (node, operator, expression) => {
    node.assign_operator = operator;
    node.expression      = expression;
    node.start           = operator.start;
    node.end             = expression.end;
};

module.exports = {
    id         : "Initializer",
    type       : "Expression",
    precedence : EXPRESSION,
    is         : (_, { current_state : s }) => s === initializer,

    initialize (node, token, parser) {
        parser.change_state("punctuator");
        const operator = parser.generate_next_node();

        parser.prepare_next_state("assignment_expression", true);
        init(node, operator, parser.generate_next_node());
    },

    refine (node, { operator, expression }, parser) {
        const is_valid_object = (
            operator   &&
            expression &&
            operator.id    === "Punctuator" &&
            operator.value === '=' &&
            expression.id  === "Assignment expression"
        );

        if (! is_valid_object) {
            parser.throw_unexpected_refine(node, operator || expression);
        }

        init(node, operator, expression);
    },
};
