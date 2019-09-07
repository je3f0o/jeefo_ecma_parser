/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : left_hand_side_expression.js
* Created at  : 2019-09-03
* Updated at  : 2019-09-08
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

const { EXPRESSION }                = require("../enums/precedence_enum");
const { left_hand_side_expression } = require("../enums/states_enum");

/*
const destructuring_expressions_tree = [
    "New expression",
    "Member expression",
    "Primary expression",
];
*/
const destructuring_expressions = [
    "Array literal",
    "Object literal"
];

const is_valid_expression = [
    "Literal",
    "Null literal",
    "Primary expression",
    "Identifier reference",
];

module.exports = {
    id         : "Left hand side expression",
    type       : "Expression",
    precedence : EXPRESSION,

    is (_, { current_state }) {
        return current_state === left_hand_side_expression;
    },

    initialize (node, token, parser) {
        parser.change_state("expression");
        LOOP:
        while (parser.next_node_definition) {
            parser.ending_index = parser.next_token.end.index;
            parser.set_prev_node(parser.generate_next_node());

            if (! parser.next_token) {
                parser.throw_unexpected_end_of_stream();
            }

            if (! is_valid_expression.includes(parser.prev_node.id)) {
                parser.throw_unexpected_token(
                    `Unexpected '${ parser.prev_node.id }' in: '${
                        node.id
                    }'`,
                    parser.prev_node
                );
            }

            if (parser.next_token.end.index === parser.ending_index) {
                parser.prepare_next_node_definition(true);
            } else {
                parser.next_node_definition = parser.ast_node_table.find(
                    parser.next_token, parser
                );
            }
        }
        const expression = parser.prev_node;

        node.expression = expression;
        node.start      = expression.start;
        node.end        = expression.end;
    },

    refine (node, expression, parser) {
        switch (expression.id) {
            case "Super property"     :
            case "Member expression"  :
            case "Primary expression" :
                expression = parser.refine("new_expression", expression);
                break;
            case "New expression"  :
            case "Call expression" : break;
            default:
                parser.throw_unexpected_refine(node, expression);
        }

        node.expression = expression;
        node.start      = expression.start;
        node.end        = expression.end;
    },

    _refine (expression, parser) {
        const node = new this.Node();
        this.refine(node, expression, parser);
        return node;
    },

    is_destructuring (expression) {
        if (expression.id === "Primary expression") {
            return destructuring_expressions.includes(
                expression.expression.id
            );
        }
    },

    is_valid_simple_assignment_target (expression, parser) {
        return expression.is_valid_simple_assignment_target(parser);
    },
};
