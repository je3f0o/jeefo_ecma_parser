/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-08-27
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

module.exports = ast_node_table => {
    [
        "async_method",
        "async_arrow_function",
        "async_function_expression",
        "function_call_expression"
    ].forEach(path => {
        const node_def = require(`./${ path }`);
        ast_node_table.register_node_definition(node_def);
    });

    const await_expr = require("./await_experession");
    ast_node_table.register_reserved_word("await", await_expr);
};
