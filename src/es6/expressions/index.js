/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-08-22
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

const exprs = [
  require("./meta_property"),

  require("./generator_method"),
  require("./method_definition"),

  require("./arrow_function"),
  require("./class_expression"),
  require("./grouping_expression"),
  require("./generator_expression"),
];

const keywords = [];
for (const keyword of ["new", "yield"]) {
  const definition = require(`./${keyword}_expression`);
  keywords.push({keyword, definition});
}

module.exports = ast_node_table => {
  for (const expr of exprs) {
    ast_node_table.register_node_definition(expr);
  }

  for (const {keyword, definition} of keywords) {
    ast_node_table.register_reserved_word(keyword, definition);
  }
};