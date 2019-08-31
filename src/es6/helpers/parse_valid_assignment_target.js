/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : parse_valid_simple_assignment_target.js
* Created at  : 2019-08-29
* Updated at  : 2019-08-30
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/6.0
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const is_destructuring = require("./is_destructuring_binding_pattern");

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

module.exports = (parser, expression_name) => {
    expression_name = "expression_no_in";

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

        if (is_destructuring(parser.prev_node)) {
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

    return parser.prev_node;
};
