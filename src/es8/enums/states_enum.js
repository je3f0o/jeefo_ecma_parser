/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : states_enum.js
* Created at  : 2019-08-27
* Updated at  : 2020-09-09
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
    "context_keyword",

    // 12 - Expressions

    // 12.3 - Left hand side expressions
    "new_expression",
    "member_operator",
    "new_member_expression",
    "computed_super_property",

    // 12.4 - Update expression
    // ----------------------------
    "update_expression",

    // 12.5 - Unary expression
    // ----------------------------
    "unary_expression",

    // 12.6 - Exponentiation expressions
    // ----------------------------
    "exponentiation_expression",

    // 12.7 - Multiplicative expressions
    // ----------------------------
    "multiplicative_expression",

    // 12.8 - Additive expressions
    // ----------------------------
    "additive_expression",

    // 12.9 - Shift expressions
    // ----------------------------
    "shift_expression",

    // 12.10 - Relational expressions
    // ----------------------------
    "relational_expression",

    // 12.11 - Equality expressions
    // ----------------------------
    "equality_expression",

    // 12.12 - Binary bitwise expressions
    // ----------------------------
    "bitwise_or_expression",
    "bitwise_xor_expression",
    "bitwise_and_expression",

    // 12.13 - Binary logical expressions
    // ----------------------------
    "logical_or_expression",
    "logical_and_expression",

    // 12.15 - Assigment expression
    // ----------------------------
    "conditional_expression",

    // 12.15.5 - Destructuring assignment
    "assignment_element",
    "assignment_rest_element",
    "destructuring_assignment_target",
    "array_assignment_pattern",
    // Object assignment
    "assignment_property",
    "assignment_property_element",
    "assignment_property_identifier",

    // 12.3.4 Function calls
    "call_expression",

    // 13.3.3 - Destructuring binding patterns
    "array_binding_pattern",
    "object_binding_pattern",

    // 14.4 - Function definitions
    "binding_rest_element",
    "function_rest_parameter",

    // 14.6 - Async function definitions
    "async_method",
    "async_method_body",
    "async_concise_body",
    "async_function_body",
    "async_function_expression",

    // 14.7 - Async arrow function definitions
    "async_arrow_function",
    "async_arrow_function_body",
    "async_arrow_binding_identifier",

    // ...
    "arguments_state",
    "formal_parameter",
    "cover_parenthesized_expression",

    // Methods
    "method_definition_async",
    "method_definition_getter",
    "method_definition_setter",
    "method_definition_generator",

].reduce((states, key, index) => {
    if (states[key]) {
        console.log("Duplicated state:", key);
        process.exit();
    }
    states[key] = next_state_value + index;
    return states;
}, Object.assign({}, states_enum));
