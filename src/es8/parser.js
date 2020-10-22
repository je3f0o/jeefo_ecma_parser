/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : parser.js
* Created at  : 2019-05-27
* Updated at  : 2020-09-09
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

parser.debug = true;

const last_value = (() => {
    let last = 0;
    for_each(es6_states_enum, (key, value) => {
        if (value > last) {
            last = value;
        }
    });
    return last;
})();

for_each(my_states, (key, value) => {
    if (value > last_value) {
        parser.state.add(key, value);
    }
});

/*
const get_node_definitions = () => {
    const nodes = [];
    Object.keys(parser.ast_node_table.reserved_words).forEach(key => {
        nodes.push(parser.ast_node_table.reserved_words[key]);
    });
    return nodes.concat(parser.ast_node_table.node_definitions);
};

const nodes = get_node_definitions().map(n => n.id);
*/

module.exports = parser;
