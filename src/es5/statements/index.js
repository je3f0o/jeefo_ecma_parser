/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-01-29
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

const if_stmt = require("./if_statement");

const stmts = [
  require("./empty_statement"),
  require("./block_statement"),
  require("./labelled_statement"),
  require("./expression_statement"),
];

const keywords = [
  {
    keyword    : "do",
    definition : require("./do_while_statement"),
  },
  {
    keyword    : "var",
    definition : require("./variable_statement"),
  },
  {
    keyword    : "for",
    definition : require("./for_statement"),
  },
  {
    keyword    : "with",
    definition : require("./with_statement"),
  },
  {
    keyword    : "while",
    definition : require("./while_statement"),
  },
  {
    keyword    : "switch",
    definition : require("./switch_statement"),
  },
  {
    keyword    : "throw",
    definition : require("./throw_statement"),
  },
  {
    keyword    : "break",
    definition : require("./break_statement"),
  },
  {
    keyword    : "return",
    definition : require("./return_statement"),
  },
  {
    keyword    : "continue",
    definition : require("./continue_statement"),
  },
  {
    keyword    : "debugger",
    definition : require("./debugger_statement"),
  },
];

module.exports = ast_node_table => {
  for (const stmt of stmts) {
    ast_node_table.register_node_definition(stmt);
  }
  for (const {keyword, definition} of keywords) {
    ast_node_table.register_reserved_word(keyword, definition);
  }

  if_stmt(ast_node_table);
};