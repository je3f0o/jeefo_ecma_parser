/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : parser.js
* Created at  : 2019-05-27
* Updated at  : 2019-08-28
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

const for_each                  = require("@jeefo/utils/object/for_each");
const my_states                 = require("./enums/states_enum");
const es5_parser                = require("../es5/parser");
const es5_states                = require("../es5/enums/states_enum");
const register_tokes            = require("./tokenizer");
const register_node_definitions = require("./ast_node_table");

const parser = es5_parser.clone("ECMA Script 6");
for_each(my_states, (key, value) => {
    if (! es5_states.hasOwnProperty(key)) {
        parser.state.add(key, value);
    }
});

register_tokes(parser.tokenizer);
register_node_definitions(parser.ast_node_table);

module.exports = parser;
