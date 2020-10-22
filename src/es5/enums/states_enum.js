/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : states_enum.js
* Created at  : 2019-02-07
* Updated at  : 2020-09-07
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
    // 11 - Lexical grammar
    // ====================

    // 11.6 - Names and Keywords
    "identifier",
    "identifier_name",
    "keyword",
    "reserved_word",
    "future_reserved_word",

    "terminal_symbol_keyword",

    // 11.7 - Punctuators
    "elision",
    "punctuator",

    // 12 - Expressions
    // ================

    // 12.1 - Identifiers
    "label_identifier",
    "binding_identifier",
    "identifier_reference",

    "primary_expression",
    "property_set_parameter",

    "expression",
    "member_expression",
    "expression_expression",

    "assignment_operator",
    "assignment_expression",

    "function_body",
    "function_expression",
    "formal_parameter_list",

    "statement",
    "if_statement",

    // Variable statements
    "variable_declaration",

    "initializer",

    "for_header",
    "for_statement",
    "for_var_declaration",

    "assignable_declaration",
    "assignable_expression",

    // 13.2 Block
    "block_statement",

    // 13.12 The switch statement
    "case_block",
    "switch_statement",

    // 13.15 The try statement
    "try_statement",
    "catch_parameter",

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
