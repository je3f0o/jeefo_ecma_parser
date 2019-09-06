/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : arguments.js
* Created at  : 2019-09-02
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

const { EXPRESSION }      = require("../enums/precedence_enum");
const { arguments_state } = require("../enums/states_enum");
const {
    is_comma,
    is_close_parenthesis,
} = require("../../helpers");

module.exports = {
    id         : "Arguments",
	type       : "Expression",
	precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === arguments_state,
	initialize : (node, token, parser) => {
        const list       = [];
        const delimiters = [];

        parser.change_state("punctuator");
        const open = parser.generate_next_node();

        parser.change_state("expression");
        parser.prepare_next_state("assignment_expression", true);
        while (! is_close_parenthesis(parser)) {
            if (parser.next_token.id === "Rest") {
                parser.change_states("spread_element", "expression");
            }
            list.push(parser.generate_next_node());

            if (parser.next_token === null) {
                parser.throw_unexpected_end_of_stream();
            }

            if (is_comma(parser)) {
                parser.change_state("punctuator");
                delimiters.push(parser.generate_next_node());
                parser.prepare_next_state("assignment_expression", true);
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
