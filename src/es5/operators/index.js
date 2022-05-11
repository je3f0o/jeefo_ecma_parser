/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-01-28
* Updated at  : 2022-05-12
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const ternary = require("./conditional_operator");
const ops = [
  require("./unary_operators"),
  require("./binary_operators"),
];

module.exports = ast_node_table => {
  ops.forEach(op => op(ast_node_table));
  ast_node_table.register_node_definition(ternary);
};