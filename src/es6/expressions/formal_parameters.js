/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : formal_parameters.js
* Created at  : 2019-09-03
* Updated at  : 2019-09-09
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

const { EXPRESSION }        = require("../enums/precedence_enum");
const { formal_parameters } = require("../enums/states_enum");
const {
    is_open_parenthesis,
    is_close_parenthesis,
} = require("../../helpers");

function parse_parameters (list, delimiters, parser) {
    LOOP:
    while (true) {
        if (parser.next_token.id === "Rest") {
            parser.change_state("function_rest_parameter");
            list.push(parser.generate_next_node());
            break;
        }
        list.push(parser.generate_next_node());

        if (! parser.next_token) {
            parser.throw_unexpected_end_of_stream();
        }

        if (parser.next_token.id !== "Delimiter") {
            parser.throw_unexpected_token();
        }
        switch (parser.next_token.value) {
            case ',' :
                parser.change_state("punctuator");
                delimiters.push(parser.generate_next_node());
                parser.prepare_next_state("formal_parameter", true);
                break;
            case ')' :
                break LOOP;
            default:
                parser.throw_unexpected_token();
        }
    }
}

module.exports = {
    id         : "Formal parameters",
	type       : "Expression",
	precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === formal_parameters,
	initialize : (node, token, parser) => {
        const list       = [];
        const delimiters = [];

        parser.expect('(', is_open_parenthesis);
        parser.change_state("punctuator");
        const open_parenthesis = parser.generate_next_node();

        parser.prepare_next_state("formal_parameter", true);
        if (! is_close_parenthesis(parser)) {
            parse_parameters(list, delimiters, parser);
        }
        parser.change_state("punctuator");
        const close_parenthesis = parser.generate_next_node();

        node.open_parenthesis  = open_parenthesis;
        node.list              = list;
        node.delimiters        = delimiters;
        node.close_parenthesis = close_parenthesis;
        node.start             = open_parenthesis.start;
        node.end               = close_parenthesis.start;
    },
};
