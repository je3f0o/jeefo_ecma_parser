/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : symbol_table.js
* Created at  : 2017-08-16
* Updated at  : 2019-03-31
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const SymbolTable = require("@jeefo/parser/src/symbol_table");

const symbol_table = new SymbolTable();

const future_reserved_words = [
    "let",
    "enum",
    "const",
    "class",
    "super",
    "yield",
    "public",
    "export",
    "import",
    "static",
    "extends",
    "package",
    "private",
    "interface",
    "protected",
    "implements",
];

symbol_table.register_reserved_words(future_reserved_words, {
    id         : "Future reserved word",
    type       : "Statement",
    precedence : 31,

    is         : () => true,
    initialize : (symbol, current_token, parser) => {
        parser.throw_unexpected_token("Found future reserved word");
    }
});

require("./delimiters")(symbol_table);
require("./operators")(symbol_table);
require("./primitives")(symbol_table);
require("./declarations")(symbol_table);
require("./expressions")(symbol_table);
require("./statements")(symbol_table);

module.exports = symbol_table;
