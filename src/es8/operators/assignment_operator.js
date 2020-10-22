/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : assignment_operator.js
* Created at  : 2019-09-03
* Updated at  : 2020-09-01
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

const {expression}                = require("../enums/states_enum");
const {ASSIGNMENT_EXPRESSION}     = require("../enums/precedence_enum");
const {get_last_non_comment_node} = require("../../helpers");

const {
    is_valid_simple_assignment_target,
} = require("../../es8/semantics/left_hand_side_expression");

const destructuring_expressions = [
    "Array literal",
    "Object literal"
];
const is_destructuring = node => destructuring_expressions.includes(node.id);

const assignment_operators = [
       '=',
      "+=",
      "-=",
      "*=",
      "/=",
      "%=",
      "&=",
      "|=",
      "^=",
     "**=",
     "<<=",
     ">>=",
    ">>>=",
];

module.exports = {
    id         : "Assignment operator",
    type       : "Assignment expression",
    precedence : ASSIGNMENT_EXPRESSION,

    is: ({id, value}, parser) => (
        parser.current_state === expression &&
        id === "Operator" &&
        assignment_operators.includes(value) &&
        get_last_non_comment_node(parser) !== null
    ),

    initialize (node, token, parser) {
        let left = get_last_non_comment_node(parser);

        if (token.value === '=' && is_destructuring(left)) {
            left = parser.refine("assignment_pattern", left);
        } else if (! is_valid_simple_assignment_target(left, parser)) {
            parser.throw_unexpected_token(
                `Invalid LeftHandSideExpression in '${
                    node.constructor.name
                }'`, left
            );
        }

        parser.change_state("punctuator");
        const operator = parser.generate_next_node();

        parser.prepare_next_state("assignment_expression", true);
        const right = parser.generate_next_node();

        node.left     = left;
        node.operator = operator;
        node.right    = right;
        node.start    = left.start;
        node.end      = right.end;

        parser.end(node);
        parser.current_state = expression;
    }
};
