/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : assignable_left_hand_side_expression.js
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

const { EXPRESSION }                 = require("../enums/precedence_enum");
const { assignable_left_expression } = require("../enums/states_enum");
const {
    is_destructuring_binding_pattern
} = require("../helpers");

// Valid destructuring targets
const destructuring_assignment_targets = [
    "Array literal",
    "Object literal"
];
const is_destructuring_target = node => {
    return destructuring_assignment_targets.includes(node.id);
};

// Valid simple assign
const valid_left_expressions = [
    "Identifier",
    "Member expression",
    "Computed member expression",
];
const is_valid_left_expression = node => {
    return valid_left_expressions.includes(node.id);
};

// Valid binding definitions
const valid_bindings_definitions = [
    "Identifier",
    "Array literal",
    "Object literal",
];
const is_valid_binding_definition = node_definition => {
    if (node_definition) {
        return valid_bindings_definitions.includes(node_definition.id);
    }
};

module.exports = {
    id         : "Assignable left hand side expression",
    type       : "Left hand side expression",
    precedence : EXPRESSION,

    is : (token, parser) => {
        return parser.current_state === assignable_left_expression;
    },
    initialize : (node, token, parser) => {
        parser.current_state  = parser.prev_state;
        const expression_name = parser.get_current_state_name();
        parser.change_state(expression_name);

        if (! is_valid_binding_definition(parser.next_node_definition)) {
            parser.throw_unexpected_token();
        }

        LOOP:
        while (parser.next_token) {
            parser.prev_node = parser.generate_next_node();
            parser.previous_nodes.push(parser.prev_node);

            // 12.3.1.3 Static Semantics: IsDestructuring
            // Reference: https://www.ecma-international.org/ecma-262/6.0/#sec-static-semantics-static-semantics-isdestructuring
            if (is_destructuring_target(parser.prev_node)) {
                parser.change_state("binding_pattern");
                continue;
            }

            if (is_destructuring_binding_pattern(parser.prev_node)) {
                parser.change_state(expression_name);
            }

            parser.prepare_next_node_definition();
            if (! parser.next_token || ! parser.next_node_definition) {
                break;
            }

            switch (parser.next_node_definition.id) {
                // 12.3.1.5 Static Semantics: IsValidSimpleAssignmentTarget
                // Referece: https://www.ecma-international.org/ecma-262/6.0/#sec-static-semantics-static-semantics-isvalidsimpleassignmenttarget
                case "Member expression" :
                case "Computed member expression" :
                    if (is_valid_left_expression(parser.prev_node)) {
                        break;
                    }
                    parser.throw_unexpected_token();
                    break;
                case "Delimiter" :
                case "In operator":
                    break LOOP;
                case "Assignment expression" :
                    if (parser.next_token.value !== '=') {
                        parser.throw_unexpected_token();
                    }
                    break LOOP;
                case "Identifier" :
                    if (parser.next_token.value !== "of") {
                        parser.throw_unexpected_token();
                    }
                    break LOOP;
                default:
                    parser.throw_unexpected_token(
                        `Invalid next_node_definition: ${
                            parser.next_node_definition.id
                        }`
                    );
            }
        }

        const expression = parser.prev_node;
        if (! expression) {
            parser.throw_unexpected_token();
        }
        if (parser.next_token === null) {
            parser.throw_unexpected_end_of_stream();
        }

        node.expression = expression;
        node.start      = expression.start;
        node.end        = expression.end;
    }
};
