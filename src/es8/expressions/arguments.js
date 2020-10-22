/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : arguments.js
* Created at  : 2019-09-02
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

const {EXPRESSION}      = require("../enums/precedence_enum");
const {arguments_state} = require("../enums/states_enum");
const {
    is_rest,
    is_open_parenthesis,
    is_close_parenthesis,
} = require("../../helpers");

module.exports = {
    id         : "Arguments",
	type       : "Member expression",
	precedence : EXPRESSION,

    is         : (_, {current_state: s}) => s === arguments_state,
	initialize : (node, token, parser) => {
        const list       = [];
        const delimiters = [];

        parser.expect('(', is_open_parenthesis);
        parser.change_state("punctuator");
        const open = parser.generate_next_node();

        parser.prepare_next_state("assignment_expression", true);

        LOOP:
        while (! is_close_parenthesis(parser)) {
            if (is_rest(parser)) parser.change_state("spread_element");
            list.push(parser.generate_next_node());

            parser.prepare_next_state("punctuator", true);
            if (parser.next_token.id !== "Delimiter") {
                parser.throw_unexpected_token();
            }
            switch (parser.next_token.value) {
                case ',' :
                    parser.change_state("punctuator");
                    delimiters.push(parser.generate_next_node());
                    parser.prepare_next_state("assignment_expression", true);
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
        node.close_parenthesis = close;
        node.start             = open.start;
        node.end               = close.end;
    },
};
