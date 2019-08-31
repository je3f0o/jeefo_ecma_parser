/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : ast_node_table.js
* Created at  : 2019-05-27
* Updated at  : 2019-08-29
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

const array_remove = require("@jeefo/utils/array/remove");

module.exports = ast_node_table => {
    // Remove old existed expressions
    ast_node_table.remove_node_defs([
        { expression : "Function call" } ,
    ]);

    // Async function declaration
    ast_node_table.register_node_definition(
        require("./declarations/async_function")
    );

    // Expression statement
    const old_expr_stmt = ast_node_table.node_definitions.find(def => {
        return def.id === "Expression statement";
    });
    array_remove(ast_node_table.node_definitions, old_expr_stmt);
    ast_node_table.register_node_definition(
        require("./statements/expression_statement")
    );

    // Register expressions
    require("./expressions")(ast_node_table);
};
