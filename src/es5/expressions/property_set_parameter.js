/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : property_set_parameter.js
* Created at  : 2019-09-06
* Updated at  : 2020-09-01
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

const {STRUCTURE}              = require("../enums/precedence_enum");
const {property_set_parameter} = require("../enums/states_enum");
const {
    is_open_parenthesis,
    is_close_parenthesis,
} = require("../../helpers");

module.exports = {
    id         : "Property set parameter list",
    type       : "Method definitions",
    precedence : STRUCTURE,

    is         : (_, {current_state: s}) => s === property_set_parameter,
    initialize : (node, token, parser) => {
        parser.change_state("punctuator");
        parser.expect('(', is_open_parenthesis);
        const open = parser.generate_next_node();

        parser.prepare_next_state("formal_parameter", true);
        if (is_close_parenthesis(parser)) {
            parser.throw_unexpected_token(
                "Setter must have exactly one formal parameter."
            );
        }
        const parameter = parser.generate_next_node();

        parser.expect(')', is_close_parenthesis);
        parser.change_state("punctuator");
        const close = parser.generate_next_node();

        node.open_parenthesis  = open;
        node.parameter         = parameter;
        node.close_parenthesis = close;
        node.start             = open.start;
        node.end               = close.end;

        parser.end(node);
    }
};
