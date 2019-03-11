/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : expressions_symbol_table.js
* Created at  : 2019-01-30
* Updated at  : 2019-02-01
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const SymbolTable              = require("../symbol_table");
const expressions_symbol_table = new SymbolTable();

expressions_symbol_table.register_symbol_definition(require("./delimiters"));
expressions_symbol_table.register_symbol_definition(require("./expressions/grouping_expression"));
require("./primitives")(expressions_symbol_table);
require("./operators")(expressions_symbol_table);
//require("./declarations")(expressions_symbol_table);
//require("./complex_notations")(es5_symbol_table);

module.exports = expressions_symbol_table;
