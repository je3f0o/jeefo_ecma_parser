/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-01-28
* Updated at  : 2019-09-01
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

module.exports = ast_node_table => {
    const fn_declaration = require("./function_declaration");
    ast_node_table.register_reserved_word("function", fn_declaration);

    ast_node_table.register_node_definition(
        require("./variable_declaration_list")
    );
};
