/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : ast_node_table.js
* Created at  : 2017-08-16
* Updated at  : 2020-09-10
* Author      : jeefo
* Purpose     :
* Description :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { AST_Node_Table } = require("@jeefo/parser");

const ast_node_table = new AST_Node_Table();

/*
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

ast_node_table.register_reserved_words(future_reserved_words, {
    id         : "Future reserved word",
    type       : "Reserved keyword",
    precedence : 99,

    is         : () => true,
    initialize : (node, current_token, parser) => {
        parser.throw_unexpected_token("Found a future reserved word");
    }
});
*/
ast_node_table.register_node_definition(require("./delimiters"));

require("./operators")(ast_node_table);
require("./primitives")(ast_node_table);
require("./declarations")(ast_node_table);
require("./expressions")(ast_node_table);
require("./statements")(ast_node_table);

[
    "./common/method_definition",
    "./literals/array_literal",
    "./literals/object_literal",
    "./expressions/elision",
    "./expressions/expression",
    "./expressions/property_set_parameter",
].forEach(path => {
    ast_node_table.register_node_definition(require(path));
});

module.exports = ast_node_table;
