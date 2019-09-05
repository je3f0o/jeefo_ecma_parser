/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : states_enum.js
* Created at  : 2019-02-07
* Updated at  : 2019-09-06
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

module.exports = [
    "elision",
    "delimiter",
    "identifier_name",
    "primary_expression",
    "property_set_parameter",

    "expression",
    "expression_no_in",

    "function_body",
    "function_expression",
    "formal_parameter_list",

    "statement",
    "if_statement",

    "of_operator",
    "variable_declaration_no_in",
    "variable_declaration_list_no_in",

    // Variable statements
    "variable_declaration",
    "variable_declaration_list",

    "initializer",

    "for_in_header",
    "for_iterator_header",
    "for_header_controller",

    "for_iterator_condition",
    "for_iterator_initializer",

    "assignable_declaration",
    "assignable_expression",

    "try_statement",
    "case_clause",
    "default_clause",

    "property_list",
    "property_name",
    "property_assign",
    "method_definition",

    "labelled_statement",
    "parenthesized_expression",
].reduce((states, key, index) => {
    states[key] = index;
    return states;
}, {});
