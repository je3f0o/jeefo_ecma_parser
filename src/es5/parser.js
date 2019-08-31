/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : parser.js
* Created at  : 2017-05-22
* Updated at  : 2019-08-08
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const for_each           = require("@jeefo/utils/object/for_each");
const JeefoParser        = require("@jeefo/parser");
const states_enum        = require("./enums/states_enum");
const es5_tokenizer      = require("./tokenizer");
const es5_ast_node_table = require("./ast_node_table");

const parser = new JeefoParser(
    "ECMA Script 5", es5_tokenizer, es5_ast_node_table
);
for_each(states_enum, (key, value) => {
    parser.state.add(key, value, key === "statement");
});

parser.onpreparation = require("./preparation_handler");

module.exports = parser;
