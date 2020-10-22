/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : states_enum.js
* Created at  : 2019-08-18
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
const states_enum = require("../../es5/enums/states_enum");

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
    // Generators
    "method",
    "method_body",
    "spread_element",
    "generator_body",
    "generator_method",
    "property_definition",
    "grouping_expression",
    "property_assignment",
    "empty_parameter_list",
    "computed_member_access",

    "contextual_keyword",

    "binding_element",
    "binding_pattern",
    "binding_property",
    "single_name_binding",
    "binding_element_pattern",
    "binding_property_element",

    "super_call",
    "new_target",
    "arrow_parameters",
    "cover_initialized_name",

    // 12.15.5 - Destructuring assignment
    // Bindings
    "assignment_pattern",
    "object_assignment_pattern",

    // 14.2 - Arrow function
    "concise_body",
    "arrow_function",
    "formal_parameters",
    "arrow_function_body",
    "arrow_formal_parameters",

    "var_statement",

    // TODO: Temporary state
    "async_state",
    "function_state",

    // 13.3 - Declarations and the Variable statement
    // ==============================================
    //
    // Lexical declaration
    "binding_list",

    // 13.3.1 - Let and Const declaration
    "lexical_binding",
    "lexical_property",
    "lexical_declaration",

    // For statement's lexical declarations
    "for_binding",
    "for_declaration",
    "for_of_statement",
    "for_in_statement",
    "for_variable_declaration",

    "static_method",
    "class_tail",
    "class_body",
    "class_heritage",
    "class_expression",

    "generator_expression",
    "generator_declaration",
].reduce((states, value, index) => {
    states[value] = next_state_value + index;
    return states;
}, Object.assign({}, states_enum));
