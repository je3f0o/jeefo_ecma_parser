/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : while_statement.js
* Created at  : 2017-08-17
* Updated at  : 2020-09-09
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.6.2
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const {statement}              = require("../enums/states_enum");
const {STATEMENT, TERMINATION} = require("../enums/precedence_enum");
const {
    is_identifier_token,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
	id         : "While statement",
	type       : "The while statement",
	precedence : STATEMENT,

	is         : (_, {current_state: s}) => s === statement,
    initialize : (node, token, parser) => {
        parser.expect("while", is_identifier_token(token, "while"));
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("parenthesized_expression", true);
        const expr = parser.generate_next_node();

        // Statement
        parser.prepare_next_state("statement", true);
        parser.parse_next_node(TERMINATION);
        const stmt = get_last_non_comment_node(parser, true);

        node.keyword           = keyword;
        node.expression        = expr;
        node.statement         = stmt;
        node.start             = keyword.start;
        node.end               = stmt.end;

        parser.terminate(node);
    }
};
