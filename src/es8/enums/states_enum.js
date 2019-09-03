/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : states_enum.js
* Created at  : 2019-08-27
* Updated at  : 2019-09-04
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

const for_each    = require("@jeefo/utils/object/for_each");
const states_enum = require("../../es6/enums/states_enum");

const next_state_value = (() => {
    let last = 0;
    for_each(states_enum, (key, value) => {
        if (value > last) {
            last = value;
        }
    });
    return last + 1;
})();

module.exports = [
    // 11.6.2.1 - Keywords
    "keyword",

    // 11.7 - Punctuators
    "punctuator",

    // 12 - Expressions
    // 12.1 - Identifiers
    "label_identifier",
    "identifier_reference",

    // 12.3 - Left hand side expressions
    "new_expression",
    "member_operator",
    "member_expression",
    "left_hand_side_expression",

    // 14.4 - Function definitions
    "formal_parameters",

    // ...
    "arguments_state",
    "formal_parameter",
    "cover_parenthesized_expression",

    "assignment_expression",

    // Arrow functions
    "arrow_formal_parameters",

    // Primitives
    "spread_element",

    // Bindings
    "assignment_pattern",

    // Object binding
    "assignment_property",
    "object_assignment_pattern",

    // Array binding
    "assignment_element",
    "assignment_rest_element",
    "assignment_elision_element",
    "array_assignment_pattern",
    "destructuring_assignment_target",

    // Async functions
    "async_arrow_function",
    "async_function_body",
    "async_function_expression",
].reduce((states, key, index) => {
    if (states[key]) {
        console.log("Duplicated state:", key);
        process.exit();
    }
    states[key] = next_state_value + index;
    return states;
}, Object.assign({}, states_enum));
