/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : meta_property.js
* Created at  : 2019-08-26
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

const {MEMBER_EXPRESSION}      = require("../enums/precedence_enum");
const {expression, new_target} = require("../enums/states_enum");
const {
    is_dot,
    is_identifier_token,
} = require("../../helpers");

module.exports = {
    id         : "New target",
	type       : "Member expression",
	precedence : MEMBER_EXPRESSION,
    is         : (_, {current_state: s}) => s === new_target,

	initialize (node, token, parser) {
        parser.expect("new", is_identifier_token(token, "new"));
        parser.change_state("keyword");
        const new_keyword = parser.generate_next_node();

        parser.prepare_next_state("punctuator");
        parser.expect('.', is_dot);
        const dot = parser.generate_next_node();

        parser.prepare_next_state("terminal_symbol_keyword", true);
        const {next_token} = parser;
        parser.expect("target", is_identifier_token(next_token, "target"));
        const target_keyword = parser.generate_next_node();

        node.new_keyword = new_keyword;
        node.dot         = dot;
        node.target      = target_keyword;
        node.start       = new_keyword.start;
        node.end         = target_keyword.end;

        parser.current_state = expression;
    },
};
