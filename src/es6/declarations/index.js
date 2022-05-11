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

const generator_declaration = require("./generator_declaration");

const named_declaraions = [];
for (const keyword of ["class", "function"]) {
  const definition = require(`./${keyword}_declaration`);
  named_declaraions.push({keyword, definition});
}

module.exports = ast_node_table => {
  ast_node_table.register_node_definition(generator_declaration);

  for (const {keyword, definition} of named_declaraions) {
    ast_node_table.register_reserved_word(keyword, definition);
  }
};