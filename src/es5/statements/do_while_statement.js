/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : do_while_statement.js
* Created at  : 2017-08-17
* Updated at  : 2020-09-09
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.6.1
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const {statement}              = require("../enums/states_enum");
const {STATEMENT, TERMINATION} = require("../enums/precedence_enum");
const {
    is_delimiter_token,
    is_identifier_token,
    has_no_line_terminator,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
	id         : "Do while statement",
	type       : "Iteration statements",
	precedence : STATEMENT,
    is         : (_, {current_state: s}) => s === statement,
	initialize : (node, token, parser) => {
        // Do keyword
        parser.expect("do", is_identifier_token(token, "do"));
        parser.change_state("keyword");
        const do_keyword = parser.generate_next_node();

        // Statement
        parser.prepare_next_state("statement", true);
        parser.parse_next_node(TERMINATION);
        const stmt = get_last_non_comment_node(parser, true);

        // While keyword
        parser.prepare_next_state("keyword", true);
        parser.expect("while", is_identifier_token(parser.next_token, "while"));
        const while_keyword = parser.generate_next_node();

        // Expression
        parser.prepare_next_state("parenthesized_expression", true);
        const expr = parser.generate_next_node();

        // Terminator
        let terminator   = null;
        const next_token = parser.look_ahead();
        const has_terminator = (
            next_token &&
            has_no_line_terminator(expr, next_token) &&
            is_delimiter_token(next_token, ';')
        );
        if (has_terminator) {
            parser.prepare_next_state("punctuator");
            terminator = parser.generate_next_node();
        }

        node.do_keyword    = do_keyword;
        node.statement     = stmt;
        node.while_keyword = while_keyword;
        node.expression    = expr;
        node.terminator    = terminator;
        node.start         = do_keyword.start;
        node.end           = (terminator || expr).end;

        parser.terminate(node);
    }
};
