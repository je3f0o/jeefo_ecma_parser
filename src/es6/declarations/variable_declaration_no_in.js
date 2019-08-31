/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : variable_declaration_no_in.js
* Created at  : 2019-08-30
* Updated at  : 2019-09-01
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

const { is_assign }   = require("../../helpers");
const { DECLARATION } = require("../enums/precedence_enum");
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

module.exports = {
    id         : "Variable declaration no in",
    type       : "Declaration",
    precedence : DECLARATION,

    is : (_, parser) => {
        return parser.current_state === variable_declaration_no_in;
    },
    initialize : (node, token, parser) => {
        let initializer = null, binding;

        if (parser.prev_state) {
            ({ binding, initializer } = parser.prev_node);
        } else {
            parser.prev_state = expression_no_in;
            parser.change_state("assignable_declaration");
            binding = parser.generate_next_node().declaration;

            if (is_assign(parser)) {
                parser.prev_state = expression_no_in;
                parser.change_state("initializer", false);
                initializer = parser.generate_next_node();
            } else if (is_destructuring_binding_pattern(binding)) {
                if (! is_valid_next_operator(parser.next_token)) {
                    parser.throw_unexpected_token(
                        "Missing initializer in destructuring declaration"
                    );
                }
            }
        }

        node.binding     = binding;
        node.initializer = initializer;
        node.start       = binding.start;
        node.end         = (initializer || binding).end;
    }
};
