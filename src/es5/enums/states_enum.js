/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : states_enum.js
* Created at  : 2019-02-07
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

module.exports = [
    "elision",
    "delimiter",
    "identifier_name",
    "primary_expression",
    "property_set_parameter",

    "expression",
    "expression_expression",

    "function_body",
    "function_expression",
    "formal_parameter_list",

    "statement",
    "if_statement",

    // Variable statements
    "variable_declaration",

    "initializer",

    "for_header",
    "for_in_header",
    "for_iterator_header",
    "of_operator",
    "variable_declaration_no_in",
    "variable_declaration_list_no_in",

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
    "getter_method",
    "setter_method",
    "method_definition",

    "labelled_statement",
    "parenthesized_expression",
].reduce((states, key, index) => {
    states[key] = index;
    return states;
}, {});
