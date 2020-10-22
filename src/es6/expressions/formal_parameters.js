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
    is_rest,
    is_open_parenthesis,
    is_close_parenthesis,
} = require("../../helpers");

function parse_parameters (list, delimiters, parser) {
    while (! is_close_parenthesis(parser)) {
        if (is_rest(parser)) {
            parser.change_state("function_rest_parameter");
            list.push(parser.generate_next_node());
            parser.prepare_next_state("punctuator", true);
            return;
        }
        list.push(parser.generate_next_node());

        parser.prepare_next_state("punctuator");
        parser.expect("Delimiter", parser.next_token.id === "Delimiter");
        switch (parser.next_token.value) {
            case ',' :
                delimiters.push(parser.generate_next_node());
                parser.prepare_next_state("formal_parameter", true);
                break;
            case ')' : return;
            default: parser.throw_unexpected_token();
        }
    }
}

module.exports = {
    id         : "Formal parameters",
	type       : "Expression",
	precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === formal_parameters,
	initialize : (node, token, parser) => {
        console.log("dead");
        process.exit();
        const list       = [];
        const delimiters = [];

        parser.expect('(', is_open_parenthesis);
        parser.change_state("punctuator");
        const open_parenthesis = parser.generate_next_node();

        parser.prepare_next_state("formal_parameter", true);
        if (! is_close_parenthesis(parser)) {
            parse_parameters(list, delimiters, parser);
        }
        parser.expect(')', is_close_parenthesis);
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
