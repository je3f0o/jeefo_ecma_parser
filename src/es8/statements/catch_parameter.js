/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : catch_parameter.js
* Created at  : 2019-09-08
* Updated at  : 2020-09-07
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

const {STRUCTURE}       = require("../enums/precedence_enum");
const {catch_parameter} = require("../enums/states_enum");
const {
    is_open_parenthesis,
    is_close_parenthesis,
} = require("../../helpers");

module.exports = {
    id         : "Catch parameter",
    type       : "The try statement",
    precedence : STRUCTURE,

    is         : (_, {current_state: s}) => s === catch_parameter,
    initialize : (node, token, parser) => {
        parser.expect('(', is_open_parenthesis);
        parser.change_state("punctuator");
        const open = parser.generate_next_node();

        parser.prepare_next_state(null, true);
        if (parser.next_token.id === "Identifier") {
            parser.change_state("binding_identifier");
        } else {
            parser.change_state("binding_pattern");
        }
        const binding = parser.generate_next_node();

        parser.prepare_next_state("punctuator", true);
        parser.expect(')', is_close_parenthesis);
        const close = parser.generate_next_node();

        node.open_parenthesis  = open;
        node.binding           = binding;
        node.close_parenthesis = close;
        node.start             = open.start;
        node.end               = close.end;
    }
};
