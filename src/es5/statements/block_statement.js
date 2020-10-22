/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : block_statement.js
* Created at  : 2017-08-18
* Updated at  : 2020-09-07
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const {STATEMENT, TERMINATION}     = require("../enums/precedence_enum");
const {statement, block_statement} = require("../enums/states_enum");
const {
    is_open_curly,
    is_close_curly,
    is_delimiter_token,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
	id         : "Block statement",
	type       : "Statement",
	precedence : STATEMENT,

    is (token, {current_state: s}) {
        switch (s) {
            case statement       : return is_delimiter_token(token, '{');
            case block_statement : return true;
        }
    },

	initialize (node, token, parser) {
        parser.expect('{', is_open_curly);
        parser.change_state("punctuator");
        const open = parser.generate_next_node();

        const list = [];
        parser.prepare_next_state("statement", true);
        while (! is_close_curly(parser)) {
            parser.context_stack.push(node.id);
            parser.parse_next_node(TERMINATION);
            parser.context_stack.pop();
            list.push(get_last_non_comment_node(parser, true));
            parser.prepare_next_state("statement", true);
        }
        parser.is_terminated = false;
        parser.change_state("punctuator");
        const close = parser.generate_next_node();

        node.open_curly_bracket  = open;
        node.statement_list      = list;
        node.close_curly_bracket = close;
        node.start               = open.start;
        node.end                 = close.end;

        parser.is_terminated = true;
    }
};
