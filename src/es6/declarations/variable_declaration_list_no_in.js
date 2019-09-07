/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : variable_declaration_list_no_in.js
* Created at  : 2019-09-08
* Updated at  : 2019-09-08
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

const { DECLARATION }                     = require("../enums/precedence_enum");
const { variable_declaration_list_no_in } = require("../enums/states_enum");

const props = [
    "keyword",
    "declaration_list",
    "delimiters",
    "terminator",
    "start",
    "end"
];

module.exports = {
    id         : "Variable declaration list no in",
    type       : "Declaration",
    precedence : DECLARATION,

    is (_, { current_state }) {
        return current_state === variable_declaration_list_no_in;
    },

    initialize : (node) => {
        console.log(node.id);
        process.exit();
    },

    refine : (node, var_stmt, parser) => {
        if (var_stmt.id !== "Variable statement") {
            parser.throw_unexpected_refine(node, var_stmt);
        }
        props.forEach(prop => {
            node[prop] = var_stmt[prop];
        });
    }
};
