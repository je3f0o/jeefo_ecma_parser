/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : break_statement.js
* Created at  : 2017-08-17
* Updated at  : 2020-09-09
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.8
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const {statement} = require("../enums/states_enum");
const {STATEMENT} = require("../enums/precedence_enum");
const {
    is_delimiter_token,
    is_identifier_token,
    has_no_line_terminator
} = require("../../helpers");

module.exports = {
	id         : "Break statement",
	type       : "Break statement",
	precedence : STATEMENT,

	is         : (token, {current_state: s}) => s === statement,
    initialize : (node, token, parser) => {
        parser.expect("break", is_identifier_token(token, "break"));
        parser.change_state("keyword");
        const keyword  = parser.generate_next_node();
        let label      = null;
        let terminator = null;

        let next_token = parser.look_ahead(true);
        const is_label = (
            next_token.id === "Identifier" &&
            has_no_line_terminator(keyword, next_token)
        );
        if (is_label) {
            parser.prepare_next_state("label_identifier", true);
            label      = parser.generate_next_node(parser);
            next_token = parser.look_ahead(true);
        }

        const has_terminator = (
            is_delimiter_token(next_token, ';') &&
            has_no_line_terminator(label || keyword, next_token)
        );
        if (has_terminator) {
            parser.prepare_next_state("punctuator", true);
            terminator = parser.generate_next_node();
        }

        node.keyword    = keyword;
        node.label      = label;
        node.terminator = terminator;
        node.start      = keyword.start;
        node.end        = (terminator || label || keyword).end;

        parser.terminate(node);
    }
};
