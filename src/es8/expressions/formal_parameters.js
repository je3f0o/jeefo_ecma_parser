/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : formal_parameters.js
* Created at  : 2019-09-03
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

const {EXPRESSION}        = require("../enums/precedence_enum");
const {formal_parameters} = require("../enums/states_enum");
const {
    is_comma,
    is_open_parenthesis,
    is_close_parenthesis,
} = require("../../helpers");

module.exports = {
    id         : "Formal parameters",
	type       : "Expression",
	precedence : EXPRESSION,
    is         : (_, {current_state: s}) => s === formal_parameters,

	initialize (node, token, parser) {
        const list         = [];
        const delimiters   = [];
        let rest_parameter = null;

        parser.expect('(', is_open_parenthesis);
        parser.change_state("punctuator");
        const open = parser.generate_next_node();

        parser.prepare_next_state("formal_parameter", true);
        LOOP:
        while (! is_close_parenthesis(parser)) {
            if (parser.next_token.id === "Rest") {
                parser.change_state("function_rest_parameter");
                rest_parameter = parser.generate_next_node();
                parser.prepare_next_state("punctuator");
                break;
            }
            list.push(parser.generate_next_node());

            parser.prepare_next_state("punctuator", true);
            if (parser.next_token.id !== "Delimiter") {
                parser.throw_unexpected_token();
            }
            switch (parser.next_token.value) {
                case ',' :
                    delimiters.push(parser.generate_next_node());
                    parser.prepare_next_state("formal_parameter", true);
                    break;
                case ')' : break LOOP;
                default: parser.throw_unexpected_token();
            }
        }
        parser.change_state("punctuator");
        const close = parser.generate_next_node();

        node.open_parenthesis  = open;
        node.list              = list;
        node.delimiters        = delimiters;
        node.rest_parameter    = rest_parameter;
        node.close_parenthesis = close;
        node.start             = open.start;
        node.end               = close.end;
    },
};
