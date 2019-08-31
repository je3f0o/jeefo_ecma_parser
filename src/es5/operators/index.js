/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-01-28
* Updated at  : 2019-08-05
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

module.exports = function register_operators (ast_node_table) {
    require("./unary_operators")(ast_node_table);
    require("./binary_operators")(ast_node_table);
    ast_node_table.register_node_definition(
        require("./conditional_operator")
    );
};
