/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-01-28
* Updated at  : 2019-03-28
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

module.exports = function register_operators (symbol_table) {
    require("./unary_operators")(symbol_table);
    require("./binary_operators")(symbol_table);
    symbol_table.register_symbol_definition(require("./conditional_operator"));
};
