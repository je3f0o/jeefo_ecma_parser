/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-01-28
* Updated at  : 2019-01-29
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

module.exports = function register_declarations (symbol_table) {
    symbol_table.register_reserved_word("var"      , require("./variable_declaration"));
    symbol_table.register_reserved_word("function" , require("./function_declaration"));
};
