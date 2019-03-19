/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-02-10
* Updated at  : 2019-03-19
* Author      : jeefo
* Purpose     :
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

module.exports = function register_expression_symbol_definitions (symbol_table) {
    //symbol_table.register_symbol_definition(require("./grouping_expression"));
    symbol_table.register_symbol_definition(require("./member_expression"));
    symbol_table.register_symbol_definition(require("./computed_member_expression"));
    symbol_table.register_symbol_definition(require("./function_call_expression"));
};
