/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : variable_declaration_no_in.js
* Created at  : 2019-08-30
* Updated at  : 2019-08-30
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

const { DECLARATION }                = require("../enums/precedence_enum");
const { is_assign_token }            = require("../../helpers");
const { initializer_definition }     = require("../nodes");
const {
    expression_no_in,
    variable_declaration_no_in,
} = require("../enums/states_enum");
const {
    is_destructuring_binding_pattern,
} = require("../helpers");

const valid_next_operators = ["in", "of"];
const is_valid_next_operator = token => {
    if (token.id === "Identifier") {
        return valid_next_operators.includes(token.value);
    }
};

const valid_bindings = [
    "Identifier",
    "Array binding pattern",
    "Object binding pattern",
];
const is_valid_binding = node => valid_bindings.includes(node.id);

module.exports = {
    id         : "Variable declaration no in",
    type       : "Declaration",
    precedence : DECLARATION,

    is : (_, parser) => {
        return parser.current_state === variable_declaration_no_in;
    },
    initialize : (node, token, parser) => {
        let binding     = parser.prev_node;
        let initializer = null;

        if (! binding) {
            parser.prev_state = expression_no_in;
            parser.change_state("assignable_left_expression");
            binding = parser.generate_next_node().expression;
        } else {
            binding = binding.expression;
        }

        if (! is_valid_binding(binding)) {
            parser.throw_unexpected_token(null, binding);
        }

        if (is_assign_token(parser.next_token)) {
            // for (var $var = value in expression) statement is valid in
            // non-strict mode.
            // Reference: https://www.ecma-international.org/ecma-262/8.0/index.html#sec-initializers-in-forin-statement-heads
            parser.change_state("expression_no_in");
            initializer = initializer_definition.generate_new_node(parser);
        } else if (is_destructuring_binding_pattern(binding)) {
            if (! is_valid_next_operator(parser.next_token)) {
                parser.throw_unexpected_token(
                    "Missing initializer in destructuring declaration"
                );
            }
        }

        node.binding     = binding;
        node.initializer = initializer;
        node.start       = binding.start;
        node.end         = (initializer || binding).end;
    }
};
