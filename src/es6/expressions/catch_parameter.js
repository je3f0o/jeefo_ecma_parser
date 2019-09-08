/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : catch_parameter.js
* Created at  : 2019-09-08
* Updated at  : 2019-09-08
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

const { EXPRESSION }      = require("../enums/precedence_enum");
const { catch_parameter } = require("../enums/states_enum");
const {
    is_open_parenthesis,
    is_close_parenthesis,
} = require("../../helpers");

module.exports = {
    id         : "Catch parameter",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === catch_parameter,
    initialize : (node, token, parser) => {
        parser.change_state("punctuator");
        parser.expect('(', is_open_parenthesis);
        const open = parser.generate_next_node();

        parser.prepare_next_state("binding_identifier", true);
        if (! parser.next_node_definition) {
            parser.change_state("binding_pattern");
        }
        const parameter = parser.generate_next_node();

        parser.prepare_next_state("punctuator", true);
        parser.expect(')', is_close_parenthesis);
        const close = parser.generate_next_node();

        node.open_parenthesis  = open;
        node.parameter         = parameter;
        node.close_parenthesis = close;
        node.start             = open.start;
        node.end               = close.end;
    }
};
