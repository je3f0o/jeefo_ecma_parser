/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : states_enum.js
* Created at  : 2019-02-07
* Updated at  : 2019-03-30
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
    "delimiter",
    "statement",
    "expression",
    "case_clause",
    "if_statement",
    "try_statement",
    "default_clause",
    "block_statement",
    "catch_parameter",
    "expression_no_in",
    "labelled_statement",
];

const states_enum = {};

keys.forEach((key, index) => states_enum[key] = index);

module.exports = states_enum;
