/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : states_enum.js
* Created at  : 2019-02-07
* Updated at  : 2019-03-18
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const keys = [
    "value",
    "delimiter",
    "parameter",
    "statement",
    "expression",
    "parameters",
    "case_clause",
    "if_statement",
    "try_statement",
    "default_clause",
    "block_statement",
    "catch_parameter",
    "expression_no_in",
    "labelled_statement",
    "conditional_expression",
];

const states_enum = {};

keys.forEach((key, index) => states_enum[key] = index);

module.exports = states_enum;
