/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : symbol_table.js
* Created at  : 2017-08-16
* Updated at  : 2017-08-17
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var JavascriptSymbolTable = require("../javascript_symbol_table");

// TODO: think about reserve, keywords...

var symbol_table = new JavascriptSymbolTable();

require("./literals")(symbol_table);
require("./delimiters")(symbol_table);
require("./statements")(symbol_table);
require("./expressions")(symbol_table);
require("./declarations")(symbol_table);
require("./unary_expressions")(symbol_table);
require("./binary_expressions")(symbol_table);

module.exports = symbol_table;
