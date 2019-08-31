/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-08-08
* Updated at  : 2019-08-30
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

const test_range       = require("./test_range");
const test_source      = require("./test_source");
const test_keyword     = require("./test_keyword");
const test_for_each    = require("./test_for_each");
const test_terminal    = require("./test_terminal");
const test_substring   = require("./test_substring");
const test_delimiter   = require("./test_delimiter");
const test_statement   = require("./test_statement");
const test_expression  = require("./test_expression");
const test_declaration = require("./test_declaration");

module.exports = {
    test_range,
    test_source,
    test_keyword,
    test_for_each,
    test_terminal,
    test_substring,
    test_delimiter,
    test_statement,
    test_expression,
    test_declaration,
};
