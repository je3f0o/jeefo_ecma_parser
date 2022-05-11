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

const fn_declaration = require("./function_declaration");

module.exports = ast_node_table => {
  ast_node_table.register_reserved_word("function", fn_declaration);
};