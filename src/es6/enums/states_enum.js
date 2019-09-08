/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : states_enum.js
* Created at  : 2019-08-18
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
    "computed_property_name",

    "contextual_keyword",

    "binding_element",
    "binding_pattern",
    "binding_property",
    "binding_identifier",
    "single_name_binding",
    "binding_element_pattern",
    "binding_property_element",

    "super_call",
    "meta_property",
    "arrow_parameters",
    "cover_initialized_name",

    // 14.2 - Arrow function
    "concise_body",
    "arrow_function",
    "formal_parameters",
    "arrow_function_body",
    "arrow_formal_parameters",

    "var_statement",
    "lexical_declaration",

    // TODO: Temporary state
    "async_state",
    "function_state",

    // Lexical declaration
    "binding_list",
    "lexical_binding",
    "lexical_property",
    "lexical_declaration",

    // For statement's lexical declarations
    "for_binding",
    "for_of_header",
    "for_declaration",
    "binding_list_no_in",
    "lexical_binding_no_in",
    "lexical_declaration_no_in",

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
