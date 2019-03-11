/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-01-26
* Updated at  : 2019-01-28
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

module.exports = function register_complex_notations (symbol_table) {
	symbol_table.register_symbol_definition(require("./slash_notation"));
	//symbol_table.register_symbol_definition(require("./function_notation"));
	symbol_table.register_symbol_definition(require("./parenthesis_notation"));
	symbol_table.register_symbol_definition(require("./curly_bracket_notation"));
};
