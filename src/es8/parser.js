/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : parser.js
* Created at  : 2019-05-27
* Updated at  : 2019-08-27
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
const es6_parser                = require("../es6/parser");
const es6_states_enum           = require("../es6/enums/states_enum");
const register_node_definitions = require("./ast_node_table");

const parser = es6_parser.clone("ECMA Script 8");
register_node_definitions(parser.ast_node_table);

for_each(my_states, (key, value) => {
    if (! es6_states_enum.hasOwnProperty(key)) {
        parser.state.add(key, value);
    }
});

module.exports = parser;
