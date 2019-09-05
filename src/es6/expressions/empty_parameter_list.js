/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : empty_parameter_list.js
* Created at  : 2019-09-06
* Updated at  : 2019-09-06
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

const { EXPRESSION }           = require("../enums/precedence_enum");
const { empty_parameter_list } = require("../enums/states_enum");
const {
    is_open_parenthesis,
    is_close_parenthesis,
} = require("../../helpers");

module.exports = {
    id         : "Empty parameter list",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === empty_parameter_list,
    initialize : (node, token, parser) => {
        parser.change_state("punctuator");
        parser.expect('(', is_open_parenthesis);
        const open = parser.generate_next_node();

        parser.prepare_next_node_definition(true);
        parser.expect(')', is_close_parenthesis);
        const close = parser.generate_next_node();

        node.open_parenthesis  = open;
        node.close_parenthesis = close;
        node.start             = open.start;
        node.end               = close.end;
    }
};
