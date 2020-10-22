/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-01-29
* Updated at  : 2020-09-07
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

module.exports = function register_statements (ast_node_table) {
    ast_node_table.register_node_definition(require("./empty_statement"));
    ast_node_table.register_node_definition(require("./block_statement"));
    ast_node_table.register_node_definition(require("./labelled_statement"));
    ast_node_table.register_node_definition(require("./expression_statement"));

    const keywords = [
        {
            path  : "./do_while_statement",
            value : "do",
        },
        {
            path  : "./variable_statement",
            value : "var",
        },
        {
            path  : "./for_statement",
            value : "for",
        },
        {
            path  : "./with_statement",
            value : "with",
        },
        {
            path  : "./while_statement",
            value : "while",
        },
        {
            path  : "./switch_statement",
            value : "switch",
        },
        {
            path  : "./throw_statement",
            value : "throw",
        },
        {
            path  : "./break_statement",
            value : "break",
        },
        {
            path  : "./return_statement",
            value : "return",
        },
        {
            path  : "./continue_statement",
            value : "continue",
        },
        {
            path  : "./debugger_statement",
            value : "debugger",
        },
    ];
    keywords.forEach(keyword => {
        const content = require(keyword.path);
        ast_node_table.register_reserved_word(keyword.value, content);
    });

    require("./if_statement")(ast_node_table);
};
