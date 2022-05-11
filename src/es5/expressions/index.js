/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-02-10
* Updated at  : 2022-05-12
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

const expressions = [
  require("./property_name"),
  require("./getter_method"),
  require("./setter_method"),
  require("./function_body"),
  require("./member_expression"),
  require("./grouping_expression"),
  require("./function_expression"),
  require("./formal_parameter_list"),
  require("./parenthesized_expression"),
  require("./function_call_expression"),
  require("./computed_member_expression"),
];

module.exports = ast_node_table => {
  for (const expr of expressions) {
    ast_node_table.register_node_definition(expr);
  }
};