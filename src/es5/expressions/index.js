/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-02-10
* Updated at  : 2020-08-27
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
        "property_name",
        "getter_method",
        "setter_method",
        "function_body",
        "member_expression",
        "grouping_expression",
        "function_expression",
        "formal_parameter_list",
        "parenthesized_expression",
        "function_call_expression",
        "computed_member_expression",
    ].forEach(path => {
        ast_node_table.register_node_definition(require(`./${ path }`));
    });
};
